import express from 'express';
import auth from '../../middlewares/auth';

import friendController from './friend.controller';
import { USER_ROLE } from '../user/user.const';

const router = express.Router();

router.post(
  '/send',
  auth(USER_ROLE.STUDENT, USER_ROLE.TEACHER),
  friendController.sendFriendRequest,
);

export const friendRoutes = router;
