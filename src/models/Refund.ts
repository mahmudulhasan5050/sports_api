import mongoose, { Document } from 'mongoose';

export interface IRefund extends Document {
  booking: string;
  user: mongoose.Types.ObjectId;
  facility: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  paymentAmount: number;
  isRefunded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const refundSchema = new mongoose.Schema({
  booking: { type: String },
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  facility: { type: mongoose.Types.ObjectId, ref: 'Facility', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
  isRefunded: { type: Boolean, default: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

const Refund = mongoose.model<IRefund>('Refund', refundSchema);
export default Refund;
