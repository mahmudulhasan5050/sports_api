import nodemailer from 'nodemailer';
import { emailPassForSender, emailSender } from '../utils/secrets';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: emailSender,
      pass: emailPassForSender,
    },
  });