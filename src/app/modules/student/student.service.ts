import Student from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const StudentServices = { getAllStudentsFromDB };
export default StudentServices;
