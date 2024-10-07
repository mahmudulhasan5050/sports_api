import mongoose, { Schema, Document } from 'mongoose';

export interface IFacility extends Document {
  type: string;
  courtNumber: number;
  pricePerHour: number;
  isActive: boolean;
}

const facilitySchema = new mongoose.Schema({
  type: {type: String, required: true},
  courtNumber: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  isActive: { type: Boolean, requered: true, default: true },
});

const Facility = mongoose.model<IFacility>('Facility', facilitySchema);
export default Facility;
