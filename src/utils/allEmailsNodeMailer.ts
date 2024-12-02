import moment from 'moment-timezone';
import { transporter } from '../config/nodemailer';
import { IBooking } from '../models/Booking';
import { IUser } from '../models/User';
import { MailOptionType } from '../types/MailOptionsType';
import { clientURL, emailSender } from './secrets';

export const sendBookingConfirmationEmail = async (booking: IBooking) => {
  if (
    !('email' in booking.user) ||
    !('name' in booking.user) ||
    !('type' in booking.facility) ||
    !('courtNumber' in booking.facility)
  ) {
    throw new Error('Booking data is not fully populated.');
  }
  console.log("booking",booking)
  const mailOptions = {
    from: emailSender,
    to: booking.user.email,
    subject: 'Booking Confirmation',
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">Booking Confirmation</h2>
            <p style="color: #555;">Hi ${booking.user.name},</p>
            <p style="color: #555;">Thank you for booking with us! Here are the details of your upcoming visit:</p>
            <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; background-color: #fff; margin: 20px 0;">
              <p><strong>Facility:</strong> ${booking.facility.type} ${
      booking.facility.courtNumber
    }</p>
              <p><strong>Date:</strong> ${moment(booking.date).format('DD-MM-YYYY')}</p>
              <p><strong>Time:</strong> ${moment(booking.startTime, 'HHmm').format('HH:mm')}</p>
              <p><strong>Duration:</strong> ${booking.duration / 60} hour/s</p>
            </div>
            <p style="color: #555;">If you have any questions or need to cancel your booking, please cancel your booking 12 hours before of your booking time.</p>
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
              We look forward to seeing you soon!
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          </div>`,
  } as MailOptionType;
  try {
    const emailDelivery = await transporter.sendMail(mailOptions);

    if (emailDelivery.accepted[0] === booking.user.email) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error:::::::::: ", error)
    
  }
};

export const sendRegistrationConfirmationEmail = async (user: IUser) => {

  const mailOptions = {
    from: emailSender,
    to: user.email,
    subject: 'Email Confirmation',
    html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="color: #333; text-align: center;">Welcome to Tennis Center</h2>
  <p style="color: #555;">Hi ${user.name},</p>
  <p style="color: #555;">
    Thank you for signing up! To complete your registration, please confirm your email address by clicking the link below:
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${clientURL}/auth/confirm/${user.emailConfirmationToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
      Confirm Email
    </a>
  </div>
  <p style="color: #555;">If the button above doesn't work, copy and paste the following link into your browser:</p>
  <p style="color: #007BFF; word-break: break-all;">
    <a href="${clientURL}/auth/confirm/${user.emailConfirmationToken}" style="color: #007BFF;">${clientURL}/auth/confirm/${user.emailConfirmationToken}</a>
  </p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
  <p style="color: #888; font-size: 12px; text-align: center;">
    If you didn't create an account, please ignore this email.
  </p>
</div>`,
  } as MailOptionType;
  try {
    const emailDelivery = await transporter.sendMail(mailOptions);
    if (emailDelivery.accepted[0] === user.email) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error:::::::::: ", error)
  }
};

export const sendResetPasswordEmail = async (user: IUser) => {
  const resetURL = `${clientURL}/reset-password/${user.passwordResetToken}`;
  const mailOptions = {
    from: emailSender,
    to: user.email,
    subject: 'Password Reset Request',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
<h2 style="color: #333; text-align: center;">Password Reset for Tennis Center</h2>
<p style="color: #555;">Hi ${user.name},</p>
<p style="color: #555;">
  We received a request to reset your password. If you requested this, please click the button below to reset your password:
</p>
<div style="text-align: center; margin: 20px 0;">
  <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
    Reset Password
  </a>
</div>
<p style="color: #555;">
  If the button above doesn’t work, copy and paste the following link into your browser:
</p>
<p style="color: #007BFF; word-break: break-all;">
  <a href="${resetURL}" style="color: #007BFF;">${resetURL}</a>
</p>
<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
<p style="color: #888; font-size: 12px; text-align: center;">
  If you did not request a password reset, please ignore this email or contact us for support.
</p>
</div>`,
  } as MailOptionType;
  try {
    const emailDelivery = await transporter.sendMail(mailOptions);
    if (emailDelivery.accepted[0] === user.email) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error:::::::::: ", error)
  }
};


