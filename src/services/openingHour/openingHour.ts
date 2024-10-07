import { NotFoundError } from '../../apiErrors/apiErrors';
import OpeningHour, { IOpeningHour } from '../../models/OpeningHour';

//get all
const allOpeningHours = () => {
  return OpeningHour.find();
};
//get by id
const getOpeningHourById = async (openingHourId: string) => {
  return await OpeningHour.findById(openingHourId);
};
//create
const createOpeningHour = async (newOpeningHour: IOpeningHour) => {
  const saveOpeningHour = await newOpeningHour.save();
  return saveOpeningHour;
};

//update
const updateOpeningHour = async (
  openingHourId: string,
  updatedOpeningHourFromBody: IOpeningHour
) => {
  const findAndUpdate = await OpeningHour.findByIdAndUpdate(
    openingHourId,
    updatedOpeningHourFromBody,
    { new: true }
  );
  if (!findAndUpdate)
    throw new NotFoundError('Can not update opening hour information!!');
  return findAndUpdate;
};

//delete
const deleteOpeningHour = async (openingHourId: string) => {
  const deleteFromDatabase = await OpeningHour.findByIdAndDelete(openingHourId);

  if (!deleteFromDatabase) throw new NotFoundError('Opening hour is not found');
  return deleteFromDatabase;
};

export default {
  allOpeningHours,
  getOpeningHourById,
  createOpeningHour,
  updateOpeningHour,
  deleteOpeningHour,
};
