import { Schema, Model, model, Document } from "mongoose";
import { IUser } from "./userModel";

interface IAddress extends Document {
    userId: IUser["_id"];
    pincode: string;
    state: string;
    city: string;
    buildingName: string;
    roadName: string;
}

const addressSchema:Schema = new Schema<IAddress>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    pincode: {
        type: String, 
        required: true
    },
    state: {
        type: String, 
        required: true
    },
    city: {
        type: String, 
        required: true
    },
    buildingName: {
        type: String, 
        required: true
    },
    roadName: {
        type: String, 
        required: true
    }
});

const Address:Model<IAddress> = model<IAddress>("Address", addressSchema);

export default Address;