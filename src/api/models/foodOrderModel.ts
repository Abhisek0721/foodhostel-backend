import { Schema, Model, model, Document } from "mongoose";
import { ISeller } from "./sellerModel";
import { IUser } from "./userModel";
import { IFoodItem } from "./foodItemModel";

export interface IFoodOrder extends Document {
  sellerId: ISeller["_id"]; // seller id
  userId: IUser["_id"]; // customer id
  foodId: IFoodItem["_id"];
  Qty : number;
  addedItems?: [];
  orderToken?: string,
  deliveryAddress : {
      pincode: string;
      buildingName: string;
      roadName: string;
      city: string;
      state: string;
  };
  foodPrice: number;
  orderDateTime?: Date;
  orderStatus?: boolean;
  cashOnDelivery?: boolean;
  sellerDecision?: string;
  delivered?: boolean;
}

const foodOrderSchema:Schema = new Schema<IFoodOrder>({
    sellerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Seller"
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    foodId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "FoodItem"
    },
    Qty: {
        type: Number,
        required: true,
        default: 1
    },
    addedItems: {
        type: []
    },
    orderToken: {
        type: String
    },
    deliveryAddress : {
        pincode: {
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
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    foodPrice: {
        type: Number,
        required: true
    },
    orderDateTime: {
        type: Date,
        default: Date.now()
    },
    orderStatus: {
        type: Boolean,
        default: false
    },
    cashOnDelivery: {
        type: Boolean,
        default: false
    },
    sellerDecision: {
        type: String,
        default: "pending"
    },
    delivered: {
        type: Boolean,
        default: false
    }
});

const FoodOrder:Model<IFoodOrder> = model<IFoodOrder>("FoodOrder", foodOrderSchema);

export default FoodOrder;