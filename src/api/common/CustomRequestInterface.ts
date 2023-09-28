import { Types } from "mongoose";
import { Request } from "express";

interface CustomRequest extends Request {
    userId: string | Types.ObjectId;
    emailId: string;
}

export default CustomRequest;