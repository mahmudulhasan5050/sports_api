import mongoose from 'mongoose';
import { NotFoundError } from '../apiErrors/apiErrors';
import Booking, { IBooking } from '../models/Booking';
import moment from 'moment-timezone';

//get all
const allBooking = async () => {
  const allBooking = await Booking.find({ isCancelled: false })
    .populate('user', 'name email role')
    .populate('facility', 'type courtNumber');

  return allBooking.filter((booking) => booking.isCancelled === false);
};

//Get by id
const getBookingById = async (bookingId: string) => {
  return await Booking.findById(bookingId)
    .populate('user', 'email')
    .populate('facility', 'type courtNumber');
};

//get by date
const getBookingByDate = async (date: string) => {
  return await Booking.find({
    date: {
      $gte: moment(date).startOf('day').toDate(), // Start of the day ($gte- greater than or equal)
      $lt: moment(date).endOf('day').toDate(), // End of the day ($lt- less than)
    },
    isCancelled: false,
  })
    .populate('user', 'name email role')
    .populate('facility', 'type courtNumber');
};

//create
const createAdminBooking = async (newBooking: IBooking) => {
  const saveBooking = await newBooking.save();
  return saveBooking;
};

//update
const updateBooking = async (
  bookingId: string,
  updatedBookingFromBody: IBooking
) => {
  const findAndUpdate = await Booking.findByIdAndUpdate(
    bookingId,
    updatedBookingFromBody,
    { new: true }
  )
    .populate('user', 'name email role')
    .populate('facility', 'type courtNumber');
  if (!findAndUpdate)
    throw new NotFoundError('Can not update booking information!!');
  return findAndUpdate;
};

//get all unpaid refund
const getUnpaidRefund = async () => {
  const allUnpaidRefundBooking = await Booking.find({
    isCancelled: true,
    isRefunded: false,
  })
    .populate('user', 'name email role')
    .populate('facility', 'type courtNumber');

  return allUnpaidRefundBooking;
};

// refund Update
const updateRefund = async (booking: IBooking) => {
  return await Booking.findByIdAndUpdate(booking._id, booking, { new: true });
};

//delete
const deleteBooking = async (bookingId: string) => {
  const deleteFromDatabase = await Booking.findByIdAndDelete(bookingId);

  if (!deleteFromDatabase) throw new NotFoundError('Facility is not found');
  return deleteFromDatabase;
};

export default {
  allBooking,
  getBookingById,
  getBookingByDate,
  createAdminBooking,
  updateBooking,
  getUnpaidRefund,
  updateRefund,
  deleteBooking,
};
