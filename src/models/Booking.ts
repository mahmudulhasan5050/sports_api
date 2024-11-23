import mongoose, { Document } from 'mongoose';
import { IUser } from './User';
import { IFacility } from './Facility';


export interface IBooking extends Document {
   user: mongoose.Types.ObjectId;
   facility: mongoose.Types.ObjectId;
   date: Date;
   startTime: string;
   endTime: string;
   duration: number;
   paymentAmount: number;
   isPaid: boolean;
   paymentAtCounter: boolean;
   isCancelled: boolean;
   isRefunded: boolean;
   cancelledAt: Date;
   refundedAt: Date;
   createdAt: Date;
 }
 
 const bookingSchema = new mongoose.Schema({
   user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
   facility: { type: mongoose.Types.ObjectId, ref: 'Facility', required: true },
   date: { type: Date, required: true },
   startTime: { type: String, required: true },
   endTime: {type: String, required: true},
   duration: { type: Number, required: true },
   paymentAmount: { type: Number, required: true, default: 0 },
   isPaid: { type: Boolean, default: false },
   paymentAtCounter:{type: Boolean, default: false},
   isCancelled: {type: Boolean, default: false},
   cancelledAt:{type: Date, default: Date.now},
   isRefunded: {type: Boolean, default: false},
   refundedAt: {type: Date, default: Date.now},
   createdAt: { type: Date, default: Date.now }
 });
  
 const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
 export default Booking;