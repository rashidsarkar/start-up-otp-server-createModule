import Teacher from './teacher.model';

const getAllTeachersFromDB = async () => {
  const result = await Teacher.find();
  return result;
};

const TeacherServices = { getAllTeachersFromDB };
export default TeacherServices;
