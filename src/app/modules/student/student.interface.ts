import { Types } from "mongoose";

export interface IStudent {
    user: Types.ObjectId;
    name: string;
    username?: string;
    phone?: string;
    email: string;
    address?: string;
    profile_image?: string;
    totalAmount?: number;
    totalPoint?: number;
}