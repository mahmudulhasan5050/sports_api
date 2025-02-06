import { config } from "dotenv";

config();

export const clientURL = process.env['CLIENT_URL'] as string
export const apiURL = process.env['API_URL'] as string
export const Port = process.env['PORT'] as string;
export const MongoUri = process.env['MONGODB_URI'] as string;
export const secretAuth = process.env['SECRET'] as string;

export const googleClientId = process.env['GOOGLE_CLIENT_ID'] as string
export const googleClientSecret = process.env['GOOGLE_CLIENT_SECRET'] as string
export const googleCallbackRedirect = process.env['API_URL'] as string


export const emailSender = process.env['EMAIL_USER'] as string
export const emailPassForSender = process.env['EMAIL_PASS'] as string

export const stripeSecretKey = process.env['STRIPE_SECRET_KEY'] as string
