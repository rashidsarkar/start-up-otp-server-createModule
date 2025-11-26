import { Types } from 'mongoose';

export interface IStudent {
  user: Types.ObjectId;
  name: string;
  email: string;
  profile_image?: string;
}
