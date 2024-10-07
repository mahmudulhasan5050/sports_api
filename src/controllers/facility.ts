import { Request, Response, NextFunction } from 'express';
import facilityServices from '../services/facility';

import Facility from '../models/Facility';
import {
  AlreadyExistError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../apiErrors/apiErrors';

//get all facilities
export const allFacility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findAllFacilities = await facilityServices.allFacilities();
    res.status(200).json(findAllFacilities);
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
};

//get Facility by Id
export const getFacilityById = async(
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  const facilityId = req.params.facilityId

  try {
    const facilityByIdSuccess = await facilityServices.getFacilityById(facilityId)
    res.status(200).json(facilityByIdSuccess)
  } catch (error) {
    next(new BadRequestError('Invalid Request', error));
  }
}

//create facility
export const createFacility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, courtNumber, pricePerHour } = req.body;

    // check existance
    const isExist = await Facility.findOne({ type, courtNumber });
    if (isExist) throw new AlreadyExistError();

    //create new facility according to user input
    const newFacility = new Facility({
      type,
      courtNumber,
      pricePerHour,
      isActive: true // Initially facility will be active. admin can can change later
    });
    // call service function to save in database
    const createSuccess = await facilityServices.createFacility(newFacility);
    res.status(200).json(createSuccess);
  } catch (error) {
    next(new BadRequestError('Can not create Product name', error));
  }
};

//update ficility
export const updateFacility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get id from params
    const facilityId = req.params.facilityId;
    //get updated info from body
    const updatedFacilityFromBody = req.body;

    const updateSuccess = await facilityServices.updateFacility(
      facilityId,
      updatedFacilityFromBody
    );

    res.status(204).json(updateSuccess);
  } catch (error) {
    next(new ForbiddenError('Can not update', error));
  }
};

export const deleteFacility = async(
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  try {
    //get id from params
    const facilityId = req.params.facilityId

    await facilityServices.deleteFacility(facilityId)
    res.status(204).end()
  } catch (error) {
    next(new BadRequestError('Can not delete.....', error));
  }
}
