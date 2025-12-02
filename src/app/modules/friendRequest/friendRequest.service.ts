import FriendRequest from './friendRequest.model';

const getAllFriendRequests = async () => {
  const result = await FriendRequest.find();
  return result;
};
//acpt or rejeject friend request recever ..also validate its salfe a receser

const handleFriendRequest = async (
  requestId: string,
  profileId: string,
  action: 'accept' | 'reject',
) => {};

const FriendRequestServices = { getAllFriendRequests };
export default FriendRequestServices;
