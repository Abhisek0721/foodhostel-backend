import { Types } from "mongoose";
import { Request } from "express";

interface CustomRequest extends Request {
    userId: string | Types.ObjectId;
    sellerId?: string | Types.ObjectId;
    phoneNumber: string;
    firstName: string;
    lastName: string;
}

export default CustomRequest;