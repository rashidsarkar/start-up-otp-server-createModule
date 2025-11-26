import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';
import StudentController from './student.controller';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.STUDENT),
  StudentController.getAllStudents,
);

export const studentRoutes = router;
