import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../apiErrors/apiErrors';
import User, { IUser } from '../models/User';

const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new ForbiddenError('User not authenticated'));
  }
  const user = req.user as unknown as IUser;

  try {
    const adminUser = await User.findById(user);
    if (adminUser && adminUser.role === 'admin') {
      next();
    } else {
      next(new ForbiddenError());
    }
  } catch (error) {
    next(error);
  }
};

export default adminAuthMiddleware;
