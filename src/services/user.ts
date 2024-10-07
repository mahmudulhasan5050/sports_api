import { NotFoundError } from '../apiErrors/apiErrors';
import User, { IUser } from '../models/User';

//get all
const allUsers = () => {
  return User.find();
};
//get by id
const getUserById = async(userId:string) =>{
  return await User.findById(userId)
}

// //create
// const createUser = async (newUser: IUser) => {
//   const saveUser = await newUser.save();
//   return saveUser;
// };

//update
const updateUser = async (
  userId: string,
  updatedUserFromBody: IUser
) => {
  const findAndUpdate = await User.findByIdAndUpdate(
    userId,
    updatedUserFromBody,
    { new: true }
  );
  if (!findAndUpdate)
    throw new NotFoundError('Can not update facility information!!');
  return findAndUpdate;
};

//delete
const deleteUser = async (userId: string) => {
  
  const deleteFromDatabase = await User.findByIdAndDelete(userId);

  if (!deleteFromDatabase) throw new NotFoundError('User not found');
  return deleteFromDatabase;
};

export default {
    allUsers,
    getUserById,
    updateUser,
    deleteUser
};
