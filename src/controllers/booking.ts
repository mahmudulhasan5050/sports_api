import { Request, Response, NextFunction } from 'express';
import bookingServices from '../services/booking';

import Booking from '../models/Booking';
import {
  AlreadyExistError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../apiErrors/apiErrors';
import Facility from '../models/Facility';
import mongoose from 'mongoose';
import User from '../models/User';
import { addMinutes } from '../utils/timeSlotHelper';
import moment from 'moment-timezone';
import { calculateDuration } from '../utils/calculationDuration';

//get all booking with limit 30 bookings
export const allBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.body.page);
  const limit = 30;
  const skip = (page - 1) * limit;


  try {
    const bookings30 = await bookingServices.allBooking(page, limit, skip);

    res.status(200).json(bookings30);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//get by id
export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookingId = req.params.bookingId;
  try {
    const bookingByIdSuccess = await bookingServices.getBookingById(bookingId);
    res.status(200).json(bookingByIdSuccess);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//get Booking by date
export const getBookingByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const date = req.params.date;
  
try {
    const bookingByDateSuccess = await bookingServices.getBookingByDate(date);

    res.status(200).json(bookingByDateSuccess);
  } catch (error) {
    next(new BadRequestError('Date is not valid', error));
  }
};

//dashboard info
export const getDashboardInfo = async(
  req: Request,
  res: Response,
  next: NextFunction
) =>{
  try {
    const allInfo = await bookingServices.getDashboardInfo()
    res.status(200).json(allInfo)
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
}

//create booking
export const createAdminBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, facilityId, date, startTime, endTime } = req.body;

  try {
    //check facilityId exist'
    const facilityExist = await Facility.findById(facilityId);
    if (!facilityExist) {
      next(new NotFoundError());
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      next(new NotFoundError());
    }


    // check existance
    const isExist = await Booking.findOne({
      facility: facilityId,
      date: {
        $gte: moment(date).startOf('day').toDate(), // Start of the day ($gte- greater than or equal)
        $lt: moment(date).endOf('day').toDate(),   // End of the day ($lt- less than)
      },
      $or: [
        {
          startTime: { $lt: endTime }, // Existing booking starts before the new booking ends
          endTime: { $gt: startTime }, // Existing booking ends after the new booking starts
        },
        {
          startTime: { $eq: startTime }, // Optional: Exact match for start time
          endTime: { $eq: endTime },     // Optional: Exact match for end time
        },
      ],
    });
    if (!isExist) {
      const duration = calculateDuration(startTime, endTime)

    const newBooking = new Booking({
      user: userExist?._id,
      facility: facilityId,
      date: date,
      startTime: startTime,
      endTime: endTime,
      paymentAmount: 0,
      duration: duration,
    });

    // call service function to save in database¨
    const createSuccess = await bookingServices.createAdminBooking(newBooking);
    res.status(200).json(createSuccess);
   
    }else{
      next(new AlreadyExistError());
    }
 

  } catch (error) {
    next(new BadRequestError('Can not create booking', error));
  }
};

//update booking
export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const bookingId = req.params.bookingId;
    //get updated info from body
    const updatedBookingFromBody = req.body;

    // check existance
    const isExist = await Booking.findById(bookingId);
    if (!isExist) throw new NotFoundError();

    const updateSuccess = await bookingServices.updateBooking(
      bookingId,
      updatedBookingFromBody
    );

    res.status(204).json(updateSuccess);
  } catch (error) {
    next(new ForbiddenError('Can not update', error));
  }
};

// get booking which has pending refund amount to pay to customer
export const getUnpaidRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findAllUnpaidRefund = await bookingServices.getUnpaidRefund();

    res.status(200).json(findAllUnpaidRefund);
  } catch (error) {

    next(new BadRequestError('Invalid Request1', error));
  }
};

// refund update in booking
export const updateRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bookingId } = req.params;

  try {
    const isExist = await Booking.findById(bookingId);
    if (isExist) {
      isExist.isRefunded = true;
      const refundSuccess = await bookingServices.updateRefund(isExist);
      res.status(201).json(refundSuccess)
    } else {
      next(new NotFoundError());
    }
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const bookingId = req.params.bookingId;

    await bookingServices.deleteBooking(bookingId);
    res.status(204).end();
  } catch (error) {
    next(new BadRequestError('Can not delete.....', error));
  }
};
