import { model, Schema } from "mongoose";
import { IStudent } from "./student.interface";

const studentSchema = new Schema<IStudent>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    profile_image: { type: String, default: "" },
    totalAmount: { type: Number, default: 0 },
    totalPoint: { type: Number, default: 0 }
}, { timestamps: true });

const Student = model<IStudent>("Student", studentSchema);
export default Student;