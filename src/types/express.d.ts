// import { Request } from 'express';

// export interface UserAuthType {
//   _id: string 
// }

// declare module 'express-serve-static-core' {
// interface Request {
//   user?: string; 
// }
// }
// src/types/express.d.ts
// import { IUser } from '../models/User';

// declare global {
//   namespace Express {
//     interface Request {
//       user: IUser;  // Optionally, if not guaranteed to be always present
//     }
//   }
// }
// namespace Express {
//     interface AuthInfo {
//       redirectURL?: string;
//     }
//   }