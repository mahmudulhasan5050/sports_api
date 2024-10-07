import mongoose from 'mongoose';
import { NotFoundError } from '../apiErrors/apiErrors';
import Booking, { IBooking } from '../models/Booking';



//create
const createBooking = async (newBooking: IBooking) => {
  const saveBooking = await newBooking.save();
  return saveBooking;
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
