import express from 'express';
import auth from '../../middlewares/auth';

import friendController from './friend.controller';
import { USER_ROLE } from '../user/user.const';
import validateRequest from '../../middlewares/validateRequest';
import FriendValidations from './friend.validation';

const router = express.Router();

router.post(
  '/send',
  auth(USER_ROLE.STUDENT, USER_ROLE.TEACHER),
  validateRequest(FriendValidations.sendFriendRequest),
  friendController.sendFriendRequest,
);

router.post(
  '/handle-request',
  auth(USER_ROLE.STUDENT, USER_ROLE.TEACHER),
  validateRequest(FriendValidations.handleRequestValidationSchema),
  friendController.handleFriendRequest,
);

export const friendRoutes = router;
