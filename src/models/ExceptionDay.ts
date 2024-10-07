import mongoose, { Schema, Document } from 'mongoose';

export interface IExceptionHour extends Document {
  date: Date;
  open: string;
  close: string;
}

const ExceptionHourSchema: Schema = new Schema({
  date: { type: Date, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

export default mongoose.model<IExceptionHour>('ExceptionHour', ExceptionHourSchema);
