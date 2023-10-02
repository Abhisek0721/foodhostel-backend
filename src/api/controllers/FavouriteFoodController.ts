import { Response } from "express";
import CustomRequest from "../common/CustomRequestInterface";
import FavouriteFood from "../models/favouriteFoodModel";
import { Types } from "mongoose";

class FavouriteFoodController {
  //API : /favourite/addToFavourite
  //Method : POST
  //Access : Public
  //Description : add food to favourite by user
  addToFavourite = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const {
        foodId,
        foodName,
      }: {
        foodId: string | undefined;
        foodName: string | undefined;
      } = req.body;

      if (!foodId || !foodName) {
        return res.status(400).json({
          status: false,
          message: "Some fields are missing in payload!",
        });
      }

      // upsert (either add or update if already exists)
      await FavouriteFood.updateOne(
        {
          userId: userId,
          foodItemId: foodId,
        },
        {
          $set: {
            foodName: foodName,
          },
        },
        {
          upsert: true,
        }
      );

      return res.status(200).json({
        status: true,
        message: "Food Item is added to favourite food list!",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /favourite/deleteFavouriteFood/:sessionId?foodId={foodId}
  //Method : DELETE
  //Access : Public
  //Description : remove food item from favourite food list
  deleteFavouriteFood = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const foodId = req.query.foodId;
      if (!foodId) {
        return res.status(400).json({
          status: false,
          message: "foodId is missing in query parameter!",
        });
      }
      await FavouriteFood.deleteOne({
        userId: userId,
        foodItemId: foodId,
      });
      return res.status(200).json({
        status: true,
        message: "Food item has been removed from favourite list!",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /favourite/getFavouriteFood/:sessionId
  //Method : GET
  //Access : Public
  //Description : fetch food item from favourite food list
  getFavouriteFood = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const fetchFavouriteFoods = await FavouriteFood.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
          },
        },
        // right join with fooditems collection
        {
          $lookup: {
            from: "fooditems", // collection name in db
            localField: "foodItemId",
            foreignField: "_id",
            pipeline: [
              {
                $unset: ["__v"],
              },
            ],
            as: "foodItem"
          }
        },
        {
          $unwind: {
            path: "$foodItem",
          }
        },
        {
          $unset: ["_id", "foodItemId", "foodName", "__v"],
        },
      ]);
      return res.status(200).json({
        status: true,
        data: fetchFavouriteFoods,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };
}

export default new FavouriteFoodController();
