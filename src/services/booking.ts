import mongoose from 'mongoose';
import { NotFoundError } from '../apiErrors/apiErrors';
import Booking, { IBooking } from '../models/Booking';
import moment from 'moment-timezone';
import User from '../models/User';

//get all
const allBooking = async (page: number, limit: number, skip: number) => {
  const allBooking = await Booking.find({ isCancelled: false })
    .skip(skip)
    .limit(limit)
    .sort({ date: -1 })
    .populate('user', 'name email role')
    .populate('facility', 'type courtNumber');
  const bookings = allBooking.filter(
    (booking) => booking.isCancelled === false
  );
  const totalBookingsssss = await Booking.countDocuments();

  return { bookings, totalBookingsssss };
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

//dashboard info
const getDashboardInfo = async () => {
  const timezone = 'Europe/Helsinki';
  const startOfCurrentMonth = moment.tz(timezone).startOf('month').toDate();
  const endOfCurrentMonth = moment.tz(timezone).endOf('month').toDate();
  const startOfLastMonth = moment
    .tz(timezone)
    .subtract(1, 'month')
    .startOf('month')
    .toDate();
  const endOfLastMonth = moment
    .tz(timezone)
    .subtract(1, 'month')
    .endOf('month')
    .toDate();

  const currentMonthCount = await Booking.countDocuments({
    date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    isCancelled: false,
  });

  const lastMonthCount = await Booking.countDocuments({
    date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    isCancelled: false,
  });
  const totalCancelledThisMonth = await Booking.countDocuments({
    date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    isCancelled: true,
  });
  const totalNotRefunded = await Booking.countDocuments({
    date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth  },
    isCancelled: true,
    isRefunded:false
  })
  const totalUser = await User.countDocuments();

  return {
    currentMonthCount,
    lastMonthCount,
    totalUser,
    totalCancelledThisMonth,
    totalNotRefunded
  };
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
  })
    .populate('user', 'name email role')
    .populate('facility', 'type courtNumber');

  return allUnpaidRefundBooking;
};

// refund Update
const updateRefund = async (booking: IBooking) => {
  return await Booking.findByIdAndUpdate(booking._id, booking, { new: true }).populate('user', 'name email').populate('facility', 'type courtNumber');
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
  getDashboardInfo,
  createAdminBooking,
  updateBooking,
  getUnpaidRefund,
  updateRefund,
  deleteBooking,
};
