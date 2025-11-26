import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IFriend } from './friend.interface';
import Friend from './friend.model';
import Student from '../student/student.model';
import Teacher from '../teacher/teacher.model';
const getModelByName = (name: 'Student' | 'Teacher') => {
  return name === 'Student' ? Student : Teacher;
};

const FriendServices = { updateUserProfile };
export default FriendServices;
