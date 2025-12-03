import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/httpStatus';
import sendResponse from '../../utils/sendResponse';
import friendRequestServices from './friendRequest.service';

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
