import catchAsync from '../../utils/catchAsync';
import httpStatus from '../../utils/httpStatus';
import sendResponse from '../../utils/sendResponse';
import studentServices from './student.service';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students fetched successfully',
    data: result,
  });
});

const StudentController = { getAllStudents };
export default StudentController;
