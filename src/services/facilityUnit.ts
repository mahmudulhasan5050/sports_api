import { NotFoundError } from '../apiErrors/apiErrors';
import FacilityUnit, { IFacilityUnit } from '../models/FacilityUnit';

//get all
const allFacilityUnits = () => {
  return FacilityUnit.find();
};

//create
const createFacilityUnit = async (newFacilityUnit: IFacilityUnit) => {
  const saveFacilityUnit = await newFacilityUnit.save();
  return saveFacilityUnit;
};

//update
const updateFacilityUnit = async (
  facilityUnitId: string,
  updatedFacilityUnitFromBody: string
) => {
  const findAndUpdate = await FacilityUnit.findByIdAndUpdate(
    facilityUnitId,
    {name: updatedFacilityUnitFromBody},
    { new: true }
  );
  if (!findAndUpdate)
    throw new NotFoundError('Can not update facilityUnit information!!');
  return findAndUpdate;
};

//delete
const deleteFacilityUnit = async (facilityUnitId: string) => {

  const deleteFromDatabase = await FacilityUnit.findByIdAndDelete(facilityUnitId);

  if (!deleteFromDatabase) throw new NotFoundError('FacilityUnit is not found');
  return deleteFromDatabase;
};

export default {
  allFacilityUnits,
  createFacilityUnit,
  updateFacilityUnit,
  deleteFacilityUnit,
};
