import FriendRequest from './friendRequest.model';

const getAllFriendRequests = async () => {
  const result = await FriendRequest.find();
  return result;
};
//acpt or rejeject friend request recever ..also validate its salfe a receser

const FriendRequestServices = { getAllFriendRequests };
export default FriendRequestServices;
