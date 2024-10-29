import mongoose from 'mongoose';
import { NotFoundError } from '../apiErrors/apiErrors';
import Booking, { IBooking } from '../models/Booking';
import facility from './facility';
import { IUser } from '../models/User';
import { IFacility } from '../models/Facility';



//create
const createBooking = async (newBooking: IBooking) => {
  const saved = await newBooking.save();
 //const populatedDetailsOfBooking = await saved.populate('facility','type courtNumber').populate('user')
 // return await Booking.findById(saved._id).populate<{user:IUser}>('user').populate<{facility: IFacility}>('facility');
return saved
};


//delete
const deleteBooking = async (bookingId: string) => {
  
  const deleteFromDatabase = await Booking.findByIdAndDelete(bookingId);

  if (!deleteFromDatabase) throw new NotFoundError('Facility is not found');
  return deleteFromDatabase;
};

export default {

    createBooking,

    deleteBooking
};
