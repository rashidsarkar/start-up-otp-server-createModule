import { model, Schema } from 'mongoose';
import { IFriendRequest } from './friendRequest.interface';
import { ENUM_REQUEST_STATUS } from './REQUEST_STATUS';

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'senderModel',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'receiverModel',
    },
    senderModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
    receiverModel: {
      type: String,
      required: true,
      enum: ['Student', 'Teacher'],
    },
    status: {
      type: String,
      enum: Object.values(ENUM_REQUEST_STATUS),
      default: ENUM_REQUEST_STATUS.PENDING,
    },
  },
  { timestamps: true },
);

const FriendRequest = model<IFriendRequest>(
  'FriendRequest',
  friendRequestSchema,
);
export default FriendRequest;
