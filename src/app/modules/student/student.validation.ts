import { z } from "zod";

export const updateStudentData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const StudentValidations = { updateStudentData };
export default StudentValidations;