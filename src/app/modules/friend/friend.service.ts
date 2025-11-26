import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IFriend } from "./friend.interface";
import Friend from "./friend.model";

const updateUserProfile = async (id: string, payload: Partial<IFriend>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await Friend.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await Friend.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const FriendServices = { updateUserProfile };
export default FriendServices;