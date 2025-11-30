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
const FriendController = { sendFriendRequest };
export default FriendController;
