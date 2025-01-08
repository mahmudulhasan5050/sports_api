import { Request, Response, NextFunction } from 'express';

import { clientURL } from '../utils/secrets';
import User, { IUser } from '../models/User';
import authServices from '../services/auth';
import {
  AlreadyExistError,
  BadRequestError,
  DoesNotExist,
  NotFoundError,
  UnauthorizedError,
} from '../apiErrors/apiErrors';
import {
  generateEmailConfirmationToken,
  genPassword,
  validPassword,
} from '../utils/crypto';
import { transporter } from '../config/nodemailer';
import {
  sendRegistrationConfirmationEmail,
  sendResetPasswordEmail,
} from '../utils/allEmailsNodeMailer';

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

    if (createSuccess) {
      //sending email. Need to work to confirm user has recieved email
      await sendRegistrationConfirmationEmail(createSuccess);
    }
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
  
      res.status(200).json(token);
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
        //sending email. Need to work to confirm user has recieved email
        await sendResetPasswordEmail(userSuccess);

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

// export const googleRedirect = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user as IUser;
// console.log("user:::::   ", user)
//   if (user) {
//     try {
//       const token = await authServices.signIn(user);

//       //redirect
//       const encodedToken = encodeURIComponent(token);
//       res.redirect(`${clientURL}/google-auth-success/${encodedToken}`);
//     } catch (error) {
//       next(new BadRequestError());
//     }
//   } else {
//     const redirectURL = (req.authInfo as any)?.redirectURL;
//     console.log("redirectURL     ",redirectURL)
//     if (redirectURL) {
//       res.redirect(`${clientURL}${redirectURL}`);
//     } else {
//       console.log("URL     ",redirectURL)
//       next(new UnauthorizedError());
//     }
//   }
// };
export const googleRedirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const redirectURL = (req.authInfo as any)?.redirectURL;
console.log("redirectURL    ",redirectURL)
  if (redirectURL) {
    // Redirect to the client with the custom error message
    console.log("redirectURL  ",redirectURL)
    res.redirect(`${clientURL}${redirectURL}`);
  } else if (req.user) {
    const user = req.user as IUser;
    try {
      const token = await authServices.signIn(user);

      // Redirect to the client with a successful token
      const encodedToken = encodeURIComponent(token);
      res.redirect(`${clientURL}/google-auth-success/${encodedToken}`);
    } catch (error) {
      next(new BadRequestError());
    }
  } else {
    next(new UnauthorizedError());
  }
};