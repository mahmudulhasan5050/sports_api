import mongoose, { Schema, Document } from 'mongoose';

export interface IFacilityUnit extends Document {
  name: string;
}

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

const FacilityUnit = mongoose.model<IFacilityUnit>(
  'FacilityUnit',
  facilitySchema
);
export default FacilityUnit;
