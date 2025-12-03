import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/httpStatus';
import sendResponse from '../../utils/sendResponse';
import friendServices from './friend.service';

// const updateUserProfile = catchAsync(async (req, res) => {
//     const { files } = req;
//     if (files && typeof files === "object" && "profile_image" in files) {
//         req.body.profile_image = files["profile_image"][0].path;
//     }
//     const result = await friendServices.updateUserProfile(
//         req.user.profileId,
//         req.body
//     );
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Profile updated successfully",
//         data: result,
//     });
// });
const sendFriendRequest = catchAsync(async (req, res) => {
  const result = await friendServices.sendFriendRequest(
    req.tokenUser.profileId,
    req.tokenUser.role,
    req.body.receiverId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const handleFriendRequest = catchAsync(async (req, res) => {
  const result = await friendServices.handleFriendRequest(
    req.body.requestId,
    req.tokenUser.profileId,
    req.body.action,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request handled successfully',
    data: result,
  });
});

const checkFriend = catchAsync(async (req, res) => {
  const result = await friendServices.checkFriend(
    req.tokenUser.profileId,
    req.body.friendId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'you are friends',
    data: result,
  });
});

const FriendController = {
  sendFriendRequest,
  handleFriendRequest,
  checkFriend,
};
export default FriendController;
