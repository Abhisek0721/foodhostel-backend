import { Schema, Model, model, Document } from "mongoose";
import { IUser } from "./userModel";
import { IFoodItem } from "./foodItemModel";

export interface IAddToFavourite extends Document {
    userId: IUser["_id"];
    foodItemId: IFoodItem["_id"];
    foodName: IFoodItem["foodName"];
}

const addToFavouriteSchema:Schema = new Schema<IAddToFavourite>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    foodItemId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "FoodItem"
    },
    foodName: {
        type: String,
        required: true
    }
});

const AddToFavourite:Model<IAddToFavourite> = model<IAddToFavourite>("AddToFavourite", addToFavouriteSchema);

export default AddToFavourite;
