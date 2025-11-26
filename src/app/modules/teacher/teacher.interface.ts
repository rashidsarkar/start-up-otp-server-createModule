import { Types } from 'mongoose';

export interface ITeacher {
  user: Types.ObjectId;
  name: string;
  email: string;
  profile_image?: string;
}
