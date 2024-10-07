import { Request, Response, NextFunction } from 'express';
import openingHourServices from '../../services/openingHour/openingHour';

import OpeningHour, { IOpeningHour } from '../../models/OpeningHour';
import {
  AlreadyExistError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../apiErrors/apiErrors';

//get all
export const allOpeningHours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findAllOpeningHours = await openingHourServices.allOpeningHours();
    res.status(200).json(findAllOpeningHours);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//get by id
export const getOpeningHourById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const openinghourId = req.params.openinghourId;
  try {
    const openingHourByIdSuccess = await openingHourServices.getOpeningHourById(
      openinghourId
    );

    res.status(200).json(openingHourByIdSuccess);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//create
export const createOpeningHour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { day, open, close } = req.body;

    //make lower case
    const dayToLowerCase = day.toLowerCase();

    // check existance
    const isExist = await OpeningHour.findOne({ dayToLowerCase });
    if (isExist) throw new AlreadyExistError();

    //create new OpeningHour according to admin input
    const newOpeningHour = new OpeningHour({
      day: dayToLowerCase,
      open,
      close,
    });
    // call service function to save in database
    const createSuccess = await openingHourServices.createOpeningHour(
      newOpeningHour
    );
    res.status(200).json(createSuccess);
  } catch (error) {
    next(new BadRequestError('Can not create opening hour name', error));
  }
};

//update
export const updateOpeningHour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const openingHourId = req.params.openingHourId;
    //get updated info from body
    const { day, open, close } = req.body;
    const updatedOpeningHourFromBody = {
      day: day.toLowerCase(),
      open: open,
      close: close,
    } as IOpeningHour;

    const updateSuccess = await openingHourServices.updateOpeningHour(
      openingHourId,
      updatedOpeningHourFromBody
    );

    res.status(204).json(updateSuccess);
  } catch (error) {
    next(new ForbiddenError('Can not update', error));
  }
};

//delete
export const deleteOpeningHour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const openingHourId = req.params.openingHourId;

    await openingHourServices.deleteOpeningHour(openingHourId);
    res.status(204).end();
  } catch (error) {
    next(new BadRequestError('Can not delete.....', error));
  }
};