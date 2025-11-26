import { Types } from 'mongoose';
import { ENUM_REQUEST_STATUS } from './REQUEST_STATUS';

export interface IFriendRequest {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  senderModel: 'Student' | 'Teacher';
  receiverModel: 'Student' | 'Teacher';
  status: ENUM_REQUEST_STATUS;
}
