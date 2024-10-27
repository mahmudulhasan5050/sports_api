import { config } from "dotenv";

config();

export const clientURL = process.env['CLIENT_URL'] as string
export const apiURL = process.env['API_URL'] as string
export const Port = process.env['PORT'] as string;
export const MongoUri = process.env['MONGODB_URI'] as string;
export const secretAuth = process.env['SECRET'] as string;

export const googleClientId = process.env['GOOGLE_ID'] as string
export const googleClientSecret = process.env['GOOGLE_CLIENT_SECRET'] as string
export const googleCallbackRedirect = process.env['GOOGLE_CALL_BACK_REDIRECT'] as string
