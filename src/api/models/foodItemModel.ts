import { Schema, Model, model, Document } from "mongoose";
import { ISeller } from "./sellerModel";

export interface IFoodItem extends Document {
  sellerId: ISeller["_id"];
  imgName: string;
  foodName: string;
  foodCategory: 'Briyani'|'Pizza'|'Burger'|'Rolls'|'Sandwich'|'Sweets'|'Others';
  beverageVolume?: number; // in ml
  foodPrice: number; // in INR
  foodRating?: number;
}

const foodItemSchema: Schema = new Schema<IFoodItem>({
  sellerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Seller",
  },
  imgName: {
    type: String,
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  foodCategory: {
    type: String,
    required: true,
  },
  beverageVolume: {
    type: Number,
  },
  foodPrice: {
    type: Number,
    required: true,
  },
  foodRating: {
    type: Number,
  },
});

foodItemSchema.index({
  foodName: "text",
  foodCategory: "text"
}); // for full search queries

const FoodItem: Model<IFoodItem> = model<IFoodItem>("FoodItem", foodItemSchema);

export default FoodItem;
