import mongoose, { mongo } from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from '../../utils/httpStatus';
import FriendRequest from './friendRequest.model';
import { ENUM_REQUEST_STATUS } from './REQUEST_STATUS';
import Friend from '../friend/friend.model';

const getAllFriendRequests = async () => {
  const result = await FriendRequest.find();
  return result;
};
//acpt or rejeject friend request recever ..also validate its salfe a receser

const FriendRequestServices = { getAllFriendRequests };
export default FriendRequestServices;
