import nodemailer from 'nodemailer';
import {
  emailPassForSender,
  emailSender
} from '../utils/secrets';

// export const transporter = nodemailer.createTransport({
//   host: 'mail.privateemail.com',
//   port: 465,
// secure: true,
//   auth: {
//     user: emailSender,
//     pass: emailPassForSender,
//   },
// }); 
 
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 587,
    auth: {
      user: emailSender,
      pass: emailPassForSender,
    },
  });

