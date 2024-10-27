import { NotFoundError } from '../apiErrors/apiErrors';
import User, { IUser } from '../models/User';

import { generateToken, issueJWT } from '../utils/crypto';
import { secretAuth } from '../utils/secrets';

//create
const signUp = async (newUser: IUser) => {
  const saveUser = await newUser.save();

  return saveUser;
};

const confirmEmail = async (user: IUser) => {
  const userId = user._id;
  const confirmUser = await User.findByIdAndUpdate(userId, user, { new: true });
  if (!confirmUser) throw new NotFoundError('Can not update user information');
  return confirmUser;
};

const signIn = async (user: IUser) => {
  const token = issueJWT(user);

  return token

};


const forgotPassword = async(user: IUser) =>{
const saveUser = await user.save()
return saveUser
}

const resetPassword = async(user:IUser)=>{
  const saveUser = await user.save()
  return saveUser
}

const googleRegister = async(user:IUser)=>{
return await user.save()
}

export default {
  signUp,
  confirmEmail,
  signIn,
  forgotPassword,
  resetPassword,
  googleRegister
};
