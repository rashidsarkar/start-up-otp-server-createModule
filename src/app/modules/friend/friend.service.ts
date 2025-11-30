import Friend from './friend.model';
import Student from '../student/student.model';
import Teacher from '../teacher/teacher.model';
import FriendRequest from '../friendRequest/friendRequest.model';
import { ENUM_REQUEST_STATUS } from '../friendRequest/REQUEST_STATUS';
import AppError from '../../errors/AppError';
import httpStatus from '../../utils/httpStatus';
type UserRole = 'Student' | 'Teacher';
const getModelByName = (name: UserRole) => {
  return name === 'Student' ? Student : Teacher;
};

const findUserById = async(id:string)=>{
    let user = await Student.findById(id)
    if(user) return {...user.toObject(),role:'Student' as UserRole}
    user = await Teacher.
}

const sendFriendRequest = async (
  senderId: string,
  senderRole: string,
  receiverId: string,
) => {};

const FriendServices = { sendFriendRequest };
export default FriendServices;
