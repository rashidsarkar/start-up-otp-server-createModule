import { Types } from 'mongoose';

export interface IFriend {
  user: Types.ObjectId;
  friend: Types.ObjectId;
  userModel: 'Student' | 'Teacher';
  friendModel: 'Student' | 'Teacher';
}
