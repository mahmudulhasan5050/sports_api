import moment from 'moment-timezone';
import { transporter } from '../config/nodemailer';
import { IBooking } from '../models/Booking';
import { IUser } from '../models/User';
import { MailOptionType } from '../types/MailOptionsType';
import { clientURL, emailSender } from './secrets';
import { firstLetterUpperCase } from './upperLowerCase';

export const sendBookingConfirmationEmail = async (booking: IBooking) => {
  if (
    !('email' in booking.user) ||
    !('name' in booking.user) ||
    !('type' in booking.facility) ||
    !('courtNumber' in booking.facility)
  ) {
    throw new Error('Booking data is not fully populated.');
  }

  const mailOptions = {
    from: emailSender,
    to: booking.user.email,
    subject: 'Booking Confirmation',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin: 0; padding-bottom: 10px; border-bottom: 2px solid #4CAF50; display: inline-block;">
            Booking Confirmation
        </h2>
    </div>

    <p style="color: #555;">Hi ${booking.user.name},</p>
    <p style="color: #555;">
        Thank you for booking with us! Here are the details of your upcoming visit:
    </p>

    <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; background-color: #f8f9fa; margin: 20px 0;">
        <p><strong>Facility:</strong> ${firstLetterUpperCase(booking.facility.type as string)} ${booking.facility.courtNumber}</p>
        <p><strong>Date:</strong> ${moment(booking.date).format('DD.MM.YYYY')}</p>
        <p><strong>Time:</strong> ${moment(booking.startTime, 'HHmm').format('HH:mm')}</p>
        <p><strong>Duration:</strong> ${booking.duration / 60} hour(s)</p>
    </div>

    <p style="color: #555;">
        If you have any questions or need to cancel your booking, please cancel at least 12 hours before your scheduled time.
    </p>

    <div style="text-align: center; margin: 20px 0;">
        <a href="https://sportslot.fi" 
           style="background-color: #3498db; color: white; padding: 12px 24px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block;">
            Manage Booking
        </a>
    </div>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

    <p style="color: #888; font-size: 12px; text-align: center;">
        We look forward to seeing you soon!<br>
        <strong>Sportslot Team</strong>
    </p>
</div>

`,
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
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin: 0; padding-bottom: 10px; border-bottom: 2px solid #4CAF50; display: inline-block;">
            Welcome to Sport Slot
        </h2>
    </div>
    
    <p style="color: #555;">Hi ${user.name},</p>
    <p style="color: #555;">
        Thank you for signing up! To complete your registration, please confirm your email address by clicking the button below:
    </p>

    <div style="text-align: center; margin: 20px 0;">
        <a href="${clientURL}/auth/confirm/${user.emailConfirmationToken}" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirm Email
        </a>
    </div>

    <p style="color: #555;">If the button above doesn't work, copy and paste the following link into your browser:</p>

    <p style="color: #007BFF; word-break: break-all; text-align: center; font-size: 14px;">
        <a href="${clientURL}/auth/confirm/${user.emailConfirmationToken}" 
           style="color: #007BFF; text-decoration: none; word-break: break-word;">
            ${clientURL}/auth/confirm/${user.emailConfirmationToken}
        </a>
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

    <p style="color: #888; font-size: 12px; text-align: center;">
        If you didn't create an account, please ignore this email.
    </p>
</div>
`,
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
    html: `<div class="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
    <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-green-500 inline-block pb-2">
            Password Reset for Sport Slot
        </h2>
    </div>

    <p class="text-gray-700">Hi <strong>${user.name}</strong>,</p>
    
    <p class="text-gray-700 mt-3">
        We received a request to reset your password. If you requested this, please click the button below to reset your password:
    </p>

    <div class="text-center my-6">
        <a href="${resetURL}" 
           class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md text-lg">
            Reset Password
        </a>
    </div>

    <p class="text-gray-700">
        If the button above doesn’t work, copy and paste the following link into your browser:
    </p>

    <p class="text-blue-600 break-words text-center mt-3">
        <a href="${resetURL}" class="text-blue-500 hover:underline">
            ${resetURL}
        </a>
    </p>

    <hr class="border-gray-300 my-6" />

    <p class="text-gray-500 text-sm text-center">
        If you did not request a password reset, please ignore this email or contact us for support.
    </p>
</div>
`,
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


