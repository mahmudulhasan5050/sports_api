// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';

// import { UnauthorizedError, ForbiddenError } from '../apiErrors/apiErrors';
// import { secretAuth } from '../utils/secrets';
// import User from '../models/User';
// import { UserAuthType } from '../types/express';

// const userAuthMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1]; //populate token variable
//   }

//   try {
//     if (token) {
//       const decoded = jwt.verify(token, secretAuth) as string; //geting only email
//       const user = await User.findOne({ email: decoded }); //user is found from database

//       if (user) {
//         if (user._id && user.email === decoded) {
//           req.user = user._id as string;
//           next();
//         } else {
//           next(new UnauthorizedError());
//         }
//       } else {
//         next(new UnauthorizedError());
//       }
//     } else {
//       next(new UnauthorizedError());
//     }
//   } catch (error) {
//     next(new ForbiddenError());
//   }
// };

// export default userAuthMiddleware;
