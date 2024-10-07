import { Request, Response, NextFunction } from 'express';
import refundServices from '../services/refund';

import Refund from '../models/Refund';
import {
  AlreadyExistError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../apiErrors/apiErrors';
import Booking from '../models/Booking';
import { IUser } from '../models/User';

//get all refund
export const allRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findAllRefund = await refundServices.allRefund();
    res.status(200).json(findAllRefund);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//get refund by Id
export const getRefundById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refundId = req.params.refundId;
  try {
    const refundByIdSuccess = await refundServices.getRefundById(refundId);
    res.status(200).json(refundByIdSuccess);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//create refund
export const createRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //need to take only booking id and get all information from booking(users action)
    //******************************************************************* */
    const { bookingId } = req.params;
    const user = req.user as IUser;

    //find booking
    const bookingById = await Booking.findById(bookingId);

    if (bookingById) {
      //create new facility according to user input
      const newRefund = new Refund({
        booking: bookingById._id,
        user: bookingById.user,
        facility: bookingById.facility,
        date: bookingById.date,
        startTime: bookingById.startTime,
        endTime: bookingById.endTime,
        paymentAmount: bookingById.paymentAmount,
        isRefunded: false,
        createdAt: Date.now(),
      });
      // call service function to save in database
      const createSuccess = await refundServices.createRefund(newRefund);
      res.status(200).json(createSuccess);
    } else {
      next(new NotFoundError());
    }
  } catch (error) {

    next(new BadRequestError('Can not create refund', error));
  }
};

//update refund
export const updateRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const refundId = req.params.refundId;
    //get updated info from body
    const updatedRefundFromBody = req.body;
    updatedRefundFromBody.updatedAt = Date.now();
    const updateSuccess = await refundServices.updateRefund(
      refundId,
      updatedRefundFromBody
    );

    res.status(204).json(updateSuccess);
  } catch (error) {

    next(new ForbiddenError('Can not update', error));
  }
};

export const deleteRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    //get id from params
    const refundId = req.params.refundId;


    await refundServices.deleteRefund(refundId);
    res.status(204).end();
  } catch (error) {
    next(new BadRequestError('Can not delete.....', error));
  }
};
