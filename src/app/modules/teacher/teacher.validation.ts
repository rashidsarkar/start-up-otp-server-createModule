import { z } from "zod";

export const updateTeacherData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const TeacherValidations = { updateTeacherData };
export default TeacherValidations;