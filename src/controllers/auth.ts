import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

import { clientURL } from '../utils/secrets';
import User, { IUser } from '../models/User';
import authServices from '../services/auth';
import {
  AlreadyExistError,
  DoesNotExist,
  NotFoundError,
  UnauthorizedError,
} from '../apiErrors/apiErrors';
import {
  hashPassword,
  generateEmailConfirmationToken,
  comparePassword,
  genPassword,
  validPassword,
} from '../utils/crypto';

// Register account-------------------------
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  try {
    const isExist = await User.findOne({ email });
    if (isExist) throw new AlreadyExistError();

    // hash password
    const hashedPassword = genPassword(password);

    //create email confirmation token
    const emailConfirmationToken = generateEmailConfirmationToken();

    const newUser = new User({
      name: name,
      email: email,
      hash: hashedPassword.hash,
      salt: hashedPassword.salt,
      emailConfirmationToken: emailConfirmationToken,
    });

    const createSuccess = await authServices.signUp(newUser);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER, // admin email
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: createSuccess.email,
      subject: 'Email Confirmation',
      html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">Welcome to Tennis Center</h2>
    <p style="color: #555;">Hi ${createSuccess.name},</p>
    <p style="color: #555;">
      Thank you for signing up! To complete your registration, please confirm your email address by clicking the link below:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env.CLIENT_URL}/auth/confirm/${emailConfirmationToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Confirm Email
      </a>
    </div>
    <p style="color: #555;">If the button above doesn't work, copy and paste the following link into your browser:</p>
    <p style="color: #007BFF; word-break: break-all;">
      <a href="${clientURL}/auth/confirm/${emailConfirmationToken}" style="color: #007BFF;">${clientURL}/auth/confirm/${emailConfirmationToken}</a>
    </p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
    <p style="color: #888; font-size: 12px; text-align: center;">
      If you didn't create an account, please ignore this email.
    </p>
  </div>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: 'User registered, please check your email to confirm' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up' });
  }
};

// Confirm email -------------------------------
export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({
      emailConfirmationToken: req.params.token,
    });

    if (!user) throw new DoesNotExist();

    user.isValid = true;
    user.emailConfirmationToken = undefined;
    const confirmSuccess = await authServices.confirmEmail(user);
    if (confirmSuccess) {
      res.status(200).json({ message: 'Email confirmed, you can now log in' });
    } else {
      res
        .status(200)
        .json({ message: 'Something went wrong. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error confirming email' });
  }
};

//login -----------------------
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    //check user is exist or not
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    //user confirmed email or not
    if (!user.isValid) {
      return res
        .status(400)
        .json({ message: 'Please confirm your email first' });
    }
    // compare password
    if (user.hash && user.salt) {
      const isMatch = validPassword(password, user.hash, user.salt);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = await authServices.signIn(user);

      res.status(200).json({
        role: token.role,
        name: token.name,
        token: token.token,
        expiresIn: token.expiresIn,
      });
    } else {
      res.status(401).json('Unauthorized Error');
    }
  } catch (error) {
    next(new UnauthorizedError());
  }
};

//forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const resetToken = generateEmailConfirmationToken();
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
      const userSuccess = await authServices.forgotPassword(user);
      if (userSuccess) {
        // Send email with reset link
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const resetURL = `${clientURL}/reset-password/${resetToken}`;
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Password Reset',
          html: `<p>You requested a password reset. Click this <a href="${resetURL}">link</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res
          .status(200)
          .json({ message: 'Password reset link sent to your email' });
      } else {
        next(new UnauthorizedError());
      }
    } else {
      next(new NotFoundError());
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset email' });
  }
};

//reset Password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Check if token has expired
    });

    if (user) {
      const hashedPassword = genPassword(password);
      user.hash = hashedPassword.hash;
      user.salt = hashedPassword.salt;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      const saveSuccess = await authServices.resetPassword(user);
      if (saveSuccess) {
        res
          .status(200)
          .json({ message: 'Password has been reset successfully' });
      } else {
        res.status(200).json({ message: 'Please check your email again!' });
      }
    } else {
      next(new NotFoundError());
    }
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};
