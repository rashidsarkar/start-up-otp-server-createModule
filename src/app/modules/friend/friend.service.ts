import Friend from './friend.model';
import Student from '../student/student.model';
import Teacher from '../teacher/teacher.model';
import FriendRequest from '../friendRequest/friendRequest.model';
import { ENUM_REQUEST_STATUS } from '../friendRequest/REQUEST_STATUS';
import AppError from '../../errors/AppError';
import httpStatus from '../../utils/httpStatus';
type UserRole = 'Student' | 'Teacher';

const findUserById = async (id: string) => {
  let user = await Student.findById(id);
  if (user) return { ...user.toObject(), role: 'Student' as UserRole };
  user = await Teacher.findById(id);
  if (user) return { ...user.toObject(), role: 'Teacher' as UserRole };
  return null;
};

const getUserModel = (role: 'STUDENT' | 'TEACHER') => {
  return role === 'STUDENT' ? Student : Teacher;
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
        status: ENUM_REQUEST_STATUS.PENDING,
      },
      {
        sender: receiverId,
        receiver: senderId,
        status: ENUM_REQUEST_STATUS.PENDING,
      },
    ],
  });
  if (pendingRequest) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request already sent');
  }
  const request = await FriendRequest.create({
    sender: senderId,
    receiver: receiverId,
    senderModel: senderRole,
    receiverModel: receiver.role,
  });
  return request;
};

const FriendServices = { sendFriendRequest };
export default FriendServices;
