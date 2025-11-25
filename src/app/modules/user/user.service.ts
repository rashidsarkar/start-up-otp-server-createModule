import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import mongoose from 'mongoose';
import { USER_ROLE } from './user.const';
import Teacher from '../teacher/teacher.model';

const createUserIntoDB = async (userData: TUser) => {
  const existingUser = await User.isUserExists(userData.email);

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, 'Email is already in use');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create user
    const [user] = await User.create([userData], { session });

    let profile;

    // Create role-based profile
    if (userData.role === USER_ROLE.TEACHER) {
      const teacherPayload = {
        ...userData,
        user: user._id,
      };

      const [teacher] = await Teacher.create([teacherPayload], { session });
      profile = teacher;

      await User.findByIdAndUpdate(
        user._id,
        { profileId: profile._id },
        { session },
      );
    }

    // COMMIT
    await session.commitTransaction();
    session.endSession();

    // Final user return
    const result = await User.findOne({ email: userData.email }).select(
      '_id name email role profileId',
    );

    return result;
  } catch (error) {
    // ROLLBACK
    await session.abortTransaction();
    session.endSession();
    throw error; // re-throw for global error handler
  }
};
const getUserFromDb = async () => {
  const user = await User.find().select('_id name email role');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return user;
};

export const UserServices = {
  createUserIntoDB,

  getUserFromDb,
};
