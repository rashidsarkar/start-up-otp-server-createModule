import httpStatus from '../../utils/httpStatus';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import teacherServices from './teacher.service';

const getAllTeachers = catchAsync(async (req, res) => {
  const result = await teacherServices.getAllTeachersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teachers fetched successfully',
    data: result,
  });
});

const TeacherController = { getAllTeachers };
export default TeacherController;
