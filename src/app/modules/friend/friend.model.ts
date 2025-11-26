import { model, Schema } from 'mongoose';
import { IFriend } from './friend.interface';

const friendSchema = new Schema<IFriend>(
  {
    user: { type: Schema.Types.ObjectId, required: true, refPath: 'userModel' },
    friend: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'friendModel',
    },
    userModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
    friendModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
  },
  { timestamps: true },
);

const Friend = model<IFriend>('Friend', friendSchema);
export default Friend;
