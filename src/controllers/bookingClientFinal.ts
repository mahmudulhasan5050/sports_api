import { Request, Response, NextFunction } from 'express';
import bookingServices from '../services/bookingClientFinal';
import nodemailer from 'nodemailer';

import Booking from '../models/Booking';
import {
  AlreadyExistError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../apiErrors/apiErrors';
import Facility from '../models/Facility';
import { addMinutes } from '../utils/timeSlotHelper';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import {
  sendBookingConfirmationEmail,
} from '../utils/allEmailsNodeMailer';

//create booking
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as IUser;
  if (!user) {
    return next(new ForbiddenError('User not authenticated'));
  }

  const facilityId = req.params.facilityId;
  const { date, time, duration, paymentAmount, isPaid } = req.body;
console.log(typeof(date))
  //check facilityId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(facilityId)) {
    throw new BadRequestError('Invalid facility ID');
  }
  try {
    //check facilityId exist'
    const facilityExist = await Facility.findById(facilityId);
    if (!facilityExist) throw new NotFoundError();
    const userExist = await User.findById(user._id);
    if (!userExist) throw new NotFoundError();

    // check existance
    const isExist = await Booking.findOne({
      facility: facilityId,
      date: date,
      startTime: time,
      isCancelled: false,
    });
    if (isExist) throw new AlreadyExistError();

    //create new facility according to user input
    const endTime = addMinutes(time, duration);

    const newBooking = new Booking({
      user: userExist._id,
      facility: facilityId,
      date: date,
      startTime: time,
      endTime: endTime,
      duration: duration,
      paymentAmount,
      isPaid,
    });
console.log("newBooking  ",newBooking)
    // call service function to save in database¨
    const createSuccess = await bookingServices.createBooking(newBooking);
    console.log("createSucces ", createSuccess)
    //------------------start from here-----------------------------------------
    if (createSuccess) {
      const pupulatedOtherData = await createSuccess.populate([
        { path: 'user' },
        { path: 'facility' },
      ]);
      //Need to apply email is sent or not
      await sendBookingConfirmationEmail(pupulatedOtherData);
    }
    res.status(200).json(createSuccess);
  } catch (error) {
    next(new BadRequestError('Can not create booking', error));
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
