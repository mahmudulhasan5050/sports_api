import nodemailer from 'nodemailer';
import {
  emailPassForSender,
  emailSender
} from '../utils/secrets';

export const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  auth: {
    user: emailSender,
    pass: emailPassForSender,
  },
});

