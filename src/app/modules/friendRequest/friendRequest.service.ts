import AppError from '../../errors/AppError';
import httpStatus from '../../utils/httpStatus';
import FriendRequest from './friendRequest.model';
import { ENUM_REQUEST_STATUS } from './REQUEST_STATUS';

const getAllFriendRequests = async () => {
  const result = await FriendRequest.find();
  return result;
};
//acpt or rejeject friend request recever ..also validate its salfe a receser

const handleFriendRequest = async (
  requestId: string,
  profileId: string,
  action: 'accept' | 'reject',
) => {
  const request = await FriendRequest.findOne({
    _id: requestId,
    receiver: profileId,
    status: { $ne: ENUM_REQUEST_STATUS.PENDING },
  });
  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, 'Request not found');
  }
};

const FriendRequestServices = { getAllFriendRequests };
export default FriendRequestServices;
