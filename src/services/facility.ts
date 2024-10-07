import { NotFoundError } from '../apiErrors/apiErrors';
import Facility, { IFacility } from '../models/Facility';

//get all
const allFacilities = () => {
  return Facility.find();
};
//get by id
const getFacilityById = async(facilityId:string) =>{
  return await Facility.findById(facilityId)
}

//create
const createFacility = async (newFacility: IFacility) => {
  const saveFacility = await newFacility.save();
  return saveFacility;
};

//update
const updateFacility = async (
  facilityId: string,
  updatedFacilityFromBody: IFacility
) => {
  const findAndUpdate = await Facility.findByIdAndUpdate(
    facilityId,
    updatedFacilityFromBody,
    { new: true }
  );
  if (!findAndUpdate)
    throw new NotFoundError('Can not update facility information!!');
  return findAndUpdate;
};

//delete
const deleteFacility = async (facilityId: string) => {
  const deleteFromDatabase = await Facility.findByIdAndDelete(facilityId);

  if (!deleteFromDatabase) throw new NotFoundError('Facility is not found');
  return deleteFromDatabase;
};

export default {
  allFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
