import { model, Schema } from 'mongoose';
import { ITeacher } from './teacher.interface';

const teacherSchema = new Schema<ITeacher>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile_image: { type: String, default: '' },
  },
  { timestamps: true },
);

const Teacher = model<ITeacher>('Teacher', teacherSchema);
export default Teacher;
