import { model, Schema } from 'mongoose';
import { IStudent } from './student.interface';

const studentSchema = new Schema<IStudent>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile_image: { type: String, default: '' },
  },
  { timestamps: true },
);

const Student = model<IStudent>('Student', studentSchema);
export default Student;
