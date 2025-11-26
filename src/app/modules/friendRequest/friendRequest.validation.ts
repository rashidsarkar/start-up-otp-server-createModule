import { z } from 'zod';

const sendRequestSchema = z.object({
  body: z.object({
    senderId: z.string().min(1),
    senderModel: z.enum(['Student', 'Teacher']),
    receiverId: z.string().min(1),
    receiverModel: z.enum(['Student', 'Teacher']),
  }),
});

const handleRequestSchema = z.object({
  body: z.object({
    requestId: z.string().min(1),
    action: z.enum(['accept', 'reject']),
    actorId: z.string().min(1),
  }),
});

const FriendRequestValidations = { sendRequestSchema, handleRequestSchema };
export default FriendRequestValidations;
