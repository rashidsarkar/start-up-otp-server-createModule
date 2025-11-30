import express from 'express';
import friendRequestController from './friendRequest.controller';

const router = express.Router();

router.get('/', friendRequestController.getAllFriendRequests);
export const friendRequestRoutes = router;
