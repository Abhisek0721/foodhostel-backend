import { Document, Model, model, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  verified: boolean;
  phoneNumber: string;
  password?: string;
}

const userSchema: Schema = new Schema<IUser>({
    firstName: {
        type: String,
        required: [true, "first name is required"],
    },
    lastName: {
        type: String,
        required: [true, "last name is required"],
    },
    verified: {
        type: Boolean,
        default: false,
        required: false,
    }, // for verification of email
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: false,
        minlength: [6, "Password must be at least 6 characters"],
    },
});


const User:Model<IUser> = model<IUser>("User", userSchema);

export default User;
