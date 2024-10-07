import mongoose, { Document } from 'mongoose';

export interface IOpeningHour extends Document {
  day: string; // here I want only name of the day to save
  open: string;
  close: string;
}

const openingHourSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

const OpeningHour = mongoose.model<IOpeningHour>(
  'OpeningHour',
  openingHourSchema
);
export default OpeningHour;