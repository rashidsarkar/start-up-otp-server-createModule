import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';
import teacherController from './teacher.controller';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.TEACHER),
  teacherController.getAllTeachers,
);

export const teacherRoutes = router;
