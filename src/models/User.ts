import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  salt?: string;
  hash?: string;
  googleId?: string;
  role: 'admin' | 'member' | 'non-member';
  isPaid: boolean;
  isValid: boolean;
  emailConfirmationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  salt: { type: String },
  hash: { type: String },
  googleId: { type: String },
  role: {
    type: String,
    enum: ['admin', 'member', 'non-member'],
    required: true,
    default: 'non-member',
  },
  isPaid: { type: Boolean, default: false },
  isValid: { type: Boolean, required: true, default: false },
  emailConfirmationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
