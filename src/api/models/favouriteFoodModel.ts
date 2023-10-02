import { Schema, Model, model, Document } from "mongoose";
import { IUser } from "./userModel";
import { IFoodItem } from "./foodItemModel";

export interface IFavouriteFood extends Document {
    userId: IUser["_id"];
    foodItemId: IFoodItem["_id"];
    foodName: IFoodItem["foodName"];
}

const favouriteFoodSchema:Schema = new Schema<IFavouriteFood>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    foodItemId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "FoodItem"
    },
    foodName: {
        type: String,
        required: true
    }
});

const FavouriteFood:Model<IFavouriteFood> = model<IFavouriteFood>("favouritefood", favouriteFoodSchema);

export default FavouriteFood;
