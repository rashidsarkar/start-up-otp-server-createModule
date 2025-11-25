import httpStatus from "http-status";
import AppError from "../../error/appError";
import { ITeacher } from "./teacher.interface";
import Teacher from "./teacher.model";

const updateUserProfile = async (id: string, payload: Partial<ITeacher>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await Teacher.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await Teacher.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const TeacherServices = { updateUserProfile };
export default TeacherServices;