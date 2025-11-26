import { z } from "zod";

export const updateFriendData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const FriendValidations = { updateFriendData };
export default FriendValidations;