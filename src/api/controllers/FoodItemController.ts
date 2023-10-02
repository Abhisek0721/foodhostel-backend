import { Request, Response } from "express";
import CustomRequest from "../common/CustomRequestInterface";
import FoodItem from "../models/foodItemModel";
import Seller, { ISeller } from "../models/sellerModel";

class FoodItemController {
  //API : /fooditem/showFoodItems?pincode={pincode}&skipFrom={skipFrom}&limit={limit}
  //Method : GET
  //Access : Public
  //Description : fetch food items (Here, query perameters is optional)
  showFoodItems = async (req: Request, res: Response) => {
    try {
      const showCategory = [
        "Briyani",
        "Pizza",
        "Burger",
        "Rolls",
        "Sandwich",
        "Sweets",
        "Others",
      ];
      let pincode = req.query?.pincode;
      let skipFrom = Number(req.query?.skipFrom);
      let limit = Number(req.query?.limit);
      let fetchActiveRestro = [];
      if (!pincode || pincode === "null") {
        pincode = "140307";
      }
      if (!skipFrom) {
        skipFrom = 0;
      }
      if (!limit) {
        limit = 20;
      }
      let fetchSellers = await Seller.find(
        {
          activate: true,
          pincode: pincode,
        },
        {
          _id: 1,
        }
      );
      for (let seller of fetchSellers) {
        fetchActiveRestro.push(seller._id);
      }
      let fetchFoodItems = await FoodItem.find(
        {
          sellerId: { $in: fetchActiveRestro },
          foodCategory: { $in: showCategory },
        },
        {},
        {
          skip: skipFrom,
          limit: limit,
        }
      );
      return res.status(200).json({
        status: true,
        data: fetchFoodItems,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /fooditem/showFilteredFoodItems?pincode={pincode}&category={category}&skipFrom={skipFrom}&limit={limit}
  //Method : GET
  //Access : Public
  //Description : fetch filtered food items
  showFilteredFoodItems = async (req: Request, res: Response) => {
    try {
      let pincode = req.query.pincode;
      let skipFrom = Number(req.query?.skipFrom);
      let limit = Number(req.query?.limit);
      let category = req.query.category;
      let fetchActiveRestro = [];
      if (!pincode || pincode === null) {
        pincode = "140307";
      }
      if (!skipFrom) {
        skipFrom = 0;
      }
      if (!limit) {
        limit = 20;
      }
      let fetchSellers = await Seller.find(
        {
          activate: true,
          pincode: pincode,
        },
        {
          _id: 1,
        }
      );
      for (let seller of fetchSellers) {
        fetchActiveRestro.push(seller._id);
      }
      let fetchFoodItems = await FoodItem.find(
        {
          sellerId: { $in: fetchActiveRestro },
          foodCategory: category,
        },
        {},
        {
          skip: skipFrom,
          limit: limit,
        }
      );
      return res.status(200).json({
        status: true,
        data: fetchFoodItems,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /fooditem/searchFood?pincode={pincode}&text={text}&skipFrom={skipFrom}&limit={limit}
  //Method : GET
  //Access : Public
  //Description : search food items
  searchFood = async (req: Request, res: Response) => {
    try {
      let { pincode, text } = req.query;
      let skipFrom = Number(req.query?.skipFrom);
      let limit = Number(req.query?.limit);
      if (!skipFrom) {
        skipFrom = 0;
      }
      if (!limit) {
        limit = 20;
      }

      let regex = new RegExp(text.toString(), "i");
      let showCategory = [
        "Briyani",
        "Pizza",
        "Burger",
        "Rolls",
        "Sandwich",
        "Sweets",
        "Others",
      ];
      let fetchActiveRestro = [];

      let fetchSellers = await Seller.find(
        {
          activate: true,
          pincode: pincode,
        },
        {
          _id: 1,
        }
      );
      for (let seller of fetchSellers) {
        fetchActiveRestro.push(seller._id);
      }
      let fetchFoodItems = await FoodItem.find(
        {
          sellerId: { $in: fetchActiveRestro },
          foodCategory: { $in: showCategory },
          $or: [{ foodName: regex }, { foodCategory: regex }],
        },
        {},
        {
          skip: skipFrom,
          limit: limit,
        }
      );

      return res.status(200).json({
        status: true,
        data: fetchFoodItems,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /fooditem/showBeverages?restroId={restroId}
  //Method : GET
  //Access : Public
  //Description : fetch beverages based on restroId (or sellerId)
  showBeverages = async (req: Request, res: Response) => {
    try {
      const sellerId = req.query.restroId;
      if (!sellerId) {
        return res.status(400).json({
          status: false,
          message: "restroId is missing in query parameter!",
        });
      }
      const fetchBeverages = await FoodItem.find({
        sellerId: sellerId,
        foodCategory: "Beverage",
      });
      return res.status(200).json({
        status: true,
        data: fetchBeverages,
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

export default new FoodItemController();
