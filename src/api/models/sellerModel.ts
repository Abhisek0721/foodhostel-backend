import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from "./userModel";

export interface ISeller extends Document {
    userId: IUser['_id'];
    activate: boolean;
    restroName: string;
    pincode: string;
    city: string;
    roadName: string;
}

const sellerSchema:Schema = new Schema<ISeller>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    activate: {
        type: Boolean,
        default: false
    },
    restroName: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    roadName: {
        type: String,
        required: true
    }
});

const Seller:Model<ISeller> = model<ISeller>("Seller", sellerSchema);

export default Seller;