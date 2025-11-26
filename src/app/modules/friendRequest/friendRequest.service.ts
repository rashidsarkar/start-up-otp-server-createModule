import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IFriendRequest } from "./friendRequest.interface";
import FriendRequest from "./friendRequest.model";

const updateUserProfile = async (id: string, payload: Partial<IFriendRequest>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await FriendRequest.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await FriendRequest.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const FriendRequestServices = { updateUserProfile };
export default FriendRequestServices;