import { Request, Response, NextFunction } from 'express';
import facilityUnitServices from '../services/facilityUnit';

import FacilityUnit from '../models/FacilityUnit';
import {
  AlreadyExistError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../apiErrors/apiErrors';

//get all facilities
export const allFacilityUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findAllFacilityUnit = await facilityUnitServices.allFacilityUnits();
    res.status(200).json(findAllFacilityUnit);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//create facility
export const createFacilityUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    
    //make lower case
    const nameToLowerCase = name.toLowerCase();

    // check existance
    const isExist = await FacilityUnit.findOne({ nameToLowerCase });
    if (isExist) throw new AlreadyExistError();

    //create new facility according to user input
    const newFacilityUnit = new FacilityUnit({
      name: nameToLowerCase,
    });
    // call service function to save in database
    const createSuccess = await facilityUnitServices.createFacilityUnit(
      newFacilityUnit
    );
    res.status(200).json(createSuccess);
  } catch (error) {
    if (error instanceof AlreadyExistError) {
      next(error);
    } else {
      next(new BadRequestError('Cannot create facility unit name', error));
    }
  }
};

//update ficility
export const updateFacilityUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const facilityUnitId = req.params.facilityUnitId;
    //get updated info from body
    const { name } = req.body;
    //make lower case
    const updatedFacilityUnitName = name.toLowerCase();

    const updateSuccess = await facilityUnitServices.updateFacilityUnit(
      facilityUnitId,
      updatedFacilityUnitName
    );

    res.status(204).json(updateSuccess);
  } catch (error) {
    next(new ForbiddenError('Can not update', error));
  }
};

export const deleteFacilityUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const facilityUnitId = req.params.facilityUnitId;

    await facilityUnitServices.deleteFacilityUnit(facilityUnitId);
    res.status(204).end();
  } catch (error) {
    next(new BadRequestError('Can not delete.....', error));
  }
};
