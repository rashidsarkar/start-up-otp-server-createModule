import { z } from 'zod';

const sendFriendRequest = z.object({
  body: z.object({
    receiverId: z.string({ required_error: 'receiverId is required' }).min(1),
  }),
});
const handleRequestValidationSchema = z.object({
  body: z.object({
    requestId: z.string({ required_error: 'requestId is required' }).min(1),
    action: z.enum(['accept', 'reject']),
  }),
});
const checkFriendValidationSchema = z.object({
  body: z.object({
    friendId: z.string({ required_error: 'friendId is required' }).min(1),
  }),
});
const FriendValidations = {
  sendFriendRequest,
  handleRequestValidationSchema,
  checkFriendValidationSchema,
};
export default FriendValidations;
