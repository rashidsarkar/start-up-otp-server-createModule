import Friend from './friend.model';
import Student from '../student/student.model';
import Teacher from '../teacher/teacher.model';
import FriendRequest from '../friendRequest/friendRequest.model';
import { ENUM_REQUEST_STATUS } from '../friendRequest/REQUEST_STATUS';
import AppError from '../../errors/AppError';
import httpStatus from '../../utils/httpStatus';
type modelType = 'Student' | 'Teacher';
const getModelByName = (name: modelType) => {
  return name === 'Student' ? Student : Teacher;
};

const sendFriendRequest = async (
  senderId: string,
  senderModel: modelType,
  receiverId: string,
  receiverModel: modelType,
) => {
  if (senderId === receiverId && senderModel === receiverModel) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot send request to yourself',
    );
  }
  const Receiver = getModelByName(receiverModel);
  const receiver = await Receiver.findById(receiverId);

  if (!receiver) {
    throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
  }
  const alreadyFriend = await Friend.findOne({
    user: senderId,
    friend: receiverId,
  });

  if (alreadyFriend) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Already friends');
  }
  const existing = await FriendRequest.findOne({
    $or: [
      {
        sender: senderId,
        receiver: receiverId,
        status: ENUM_REQUEST_STATUS.PENDING,
      },

      {
        sender: receiverId,
        receiver: senderId,
        status: ENUM_REQUEST_STATUS.PENDING,
      },
    ],
  });

  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request already sent');
  }
  const request = await FriendRequest.create({
    sender: senderId,
    senderModel,
    receiver: receiverId,
    receiverModel,
  });
  return request;
};

const FriendServices = { sendFriendRequest };
export default FriendServices;
