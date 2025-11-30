import { z } from 'zod';

export const sendFriendRequest = z.object({
  body: z.object({
    receiverId: z.string({ required_error: 'receiverId is required' }).min(1),
  }),
});

const FriendValidations = { sendFriendRequest };
export default FriendValidations;
