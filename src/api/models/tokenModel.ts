import { Schema, Model, Document, model } from "mongoose";
import { IUser } from "./userModel";

export interface IToken extends Document {
    userId: IUser["_id"];
    token: string;
    createdAt?: Date;
}

const tokenSchema:Schema = new Schema<IToken>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60*60 // expires in 1 hour
    }
});

const Token:Model<IToken> = model<IToken>("Token", tokenSchema);

export default Token;