import { Request, Response, NextFunction } from 'express';
import userServices from '../services/user';

import User from '../models/User';
import {
  AlreadyExistError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../apiErrors/apiErrors';

//get all facilities
export const allUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findAllUsers = await userServices.allUsers();
    res.status(200).json(findAllUsers);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//get user by Id
export const getUserById = async(
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  const userId = req.params.userId

  try {
    const userByIdSuccess = await userServices.getUserById(userId)
    res.status(200).json(userByIdSuccess)
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
}

// //create 
// export const createUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { name, email, password } = req.body;

//     // check existance
//     const isExist = await User.findOne({ email });
//     if (isExist) throw new AlreadyExistError();

//     //create new new according to user input
//     const newUser = new User({
// name, email, password
//     });
//     // call service function to save in database
//     const createSuccess = await userServices.createUser(newUser);
//     res.status(200).json(createSuccess);
//   } catch (error) {
//     next(new BadRequestError('Can not create user', error));
//   }
// };

//update
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const userId = req.params.userId;
    //get updated info from body
    const updatedUserFromBody = req.body;

    const updateSuccess = await userServices.updateUser(
        userId,
        updatedUserFromBody
    );

    res.status(204).json(updateSuccess);
  } catch (error) {
    next(new ForbiddenError('Can not update', error));
  }
};

export const deleteUser = async(
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  try {
    //get id from params
    const userId = req.params.userId

    await userServices.deleteUser(userId)
    res.status(204).end()
  } catch (error) {
    next(new BadRequestError('Can not delete.....', error));
  }
}
