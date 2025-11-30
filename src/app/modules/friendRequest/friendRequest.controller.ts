import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/httpStatus';
import sendResponse from '../../utils/sendResponse';
import friendRequestServices from './friendRequest.service';

// const updateUserProfile = catchAsync(async (req, res) => {
//     const { files } = req;
//     if (files && typeof files === "object" && "profile_image" in files) {
//         req.body.profile_image = files["profile_image"][0].path;
//     }
//     const result = await friendRequestServices.updateUserProfile(
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

const getAllFriendRequests = catchAsync(async (req, res) => {
  const result = await friendRequestServices.getAllFriendRequests();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend requests fetched successfully',
    data: result,
  });
});

const FriendRequestController = { getAllFriendRequests };
export default FriendRequestController;
