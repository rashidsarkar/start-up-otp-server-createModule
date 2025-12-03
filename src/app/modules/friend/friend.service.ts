import Friend from './friend.model';
import Student from '../student/student.model';
import Teacher from '../teacher/teacher.model';
import FriendRequest from '../friendRequest/friendRequest.model';
import { ENUM_REQUEST_STATUS } from '../friendRequest/REQUEST_STATUS';
import AppError from '../../errors/AppError';
import httpStatus from '../../utils/httpStatus';
import mongoose from 'mongoose';
type UserRole = 'Student' | 'Teacher';

const findUserById = async (id: string) => {
  let user = await Student.findById(id);
  if (user) return { ...user.toObject(), role: 'Student' as UserRole };
  user = await Teacher.findById(id);
  if (user) return { ...user.toObject(), role: 'Teacher' as UserRole };
  // throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  return null;
};

const sendFriendRequest = async (
  senderId: string,
  senderRoleFromToken: 'STUDENT' | 'TEACHER',
  receiverId: string,
) => {
  const receiver = await findUserById(receiverId);
  if (!receiver) {
    throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
  }

  const senderRole: UserRole =
    senderRoleFromToken === 'STUDENT' ? 'Student' : 'Teacher';

  if (senderId === receiverId && senderRole === receiver.role) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot send request to yourself',
    );
  }

  const alreadyFriend = await Friend.findOne({
    $or: [
      {
        user: senderId,
        friend: receiverId,
      },
      {
        user: receiverId,
        friend: senderId,
      },
    ],
  });

  if (alreadyFriend) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Already friends');
  }
  const pendingRequest = await FriendRequest.findOne({
    $or: [
      {
        sender: senderId,
        receiver: receiverId,
      },
      {
        sender: receiverId,
        receiver: senderId,
      },
    ],
    status: ENUM_REQUEST_STATUS.PENDING,
  });
  if (pendingRequest) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request already sent');
  }
  const request = await FriendRequest.create({
    sender: senderId,
    receiver: receiverId,
    senderModel: senderRole,
    receiverModel: receiver.role,
    status: ENUM_REQUEST_STATUS.PENDING,
  });
  return request;
};
const handleFriendRequest = async (
  requestId: string,
  profileId: string,
  action: 'accept' | 'reject',
) => {
  const request = await FriendRequest.findById(requestId);

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, 'Request not found');
  }

  if (request.receiver.toString() !== profileId) {
    throw new AppError(httpStatus.BAD_REQUEST, `Not authorized ${profileId}`);
  }
  if (request.status !== ENUM_REQUEST_STATUS.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request already handled');
  }
  if (action === 'reject') {
    request.status = ENUM_REQUEST_STATUS.REJECTED;
    await request.save();
    return request;
  }

  // acept flow
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    request.status = ENUM_REQUEST_STATUS.ACCEPTED;
    await request.save({ session });
    const newFriend = await Friend.create(
      [
        {
          user: request.sender,
          userModel: request.senderModel,
          friend: request.receiver,
          friendModel: request.receiverModel,
        },
        {
          user: request.receiver,
          userModel: request.receiverModel,
          friend: request.sender,
          friendModel: request.senderModel,
        },
      ],
      { session },
    );
    await session.commitTransaction();
    session.endSession();
    return { request, newFriend };
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Something went wrong handleFriendRequest',
    );
  }
};

const checkFriend = async (profileId: string, friendId: string) => {
  const alreadyFriend = await Friend.findOne({
    $or: [
      {
        user: profileId,
        friend: friendId,
      },
      {
        user: friendId,
        friend: profileId,
      },
    ],
  });

  if (!alreadyFriend) {
    throw new AppError(httpStatus.BAD_REQUEST, 'you are not friends');
  }
  return alreadyFriend;
};

const FriendServices = { sendFriendRequest, handleFriendRequest, checkFriend };
export default FriendServices;
