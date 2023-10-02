import { Request, Response } from "express";
import CustomRequest from "../common/CustomRequestInterface";
import Seller from "../models/sellerModel";
// import saveFoodImages from "../../utils/imageUploadUtils";
import FoodItem from "../models/foodItemModel";
import SellerClass from "../classes/SellerClass";
import FoodOrder from "../models/foodOrderModel";

// API's related to restro partners

class SellerController {
  //API : /restro/joinus
  //Method : POST
  //Access : Public
  //Description : join foodhostel as a restro partner
  joinus = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const {
        restroName,
        pincode,
        city,
        roadName,
      }: {
        restroName: string | undefined;
        pincode: string | undefined;
        city: string | undefined;
        roadName: string | undefined;
      } = req.body;
      let checkSeller = await Seller.exists({ userId: userId });

      if (!checkSeller) {
        let seller = new Seller({
          userId: userId,
          activate: false,
          restroName: restroName,
          pincode: pincode,
          city: city,
          roadName: roadName,
        });
        seller.save();
        return res.status(200).json({
          status: true,
          message: "Created restro account successfully!",
        });
      }

      return res.status(200).json({
        status: false,
        message: "Restro account already exists!",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/getRestroDetails/:sessionId
  //Method : GET
  //Access : Public
  //Description : get details of restro partner
  getRestroDetails = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const checkSeller = await Seller.findOne({
        userId: userId,
      });
      return res.status(200).json({
        status: true,
        data: checkSeller,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/addFood
  //Method : POST
  //Access : Public
  //Description : add food item
  addFood = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const {
        foodName,
        foodCategory,
        beverageVolume,
        foodPrice,
      }: {
        foodName: string;
        foodCategory:
          | "Briyani"
          | "Pizza"
          | "Burger"
          | "Rolls"
          | "Sandwich"
          | "Sweets"
          | "Others";
        beverageVolume?: number;
        foodPrice: number | string;
      } = req.body;
      const files = req.files?.selectedImage;
      if (!files) {
        return res.status(400).json({
          status: false,
          message: "File is not uploaded!",
        });
      }
      const imageFile: any = req.files?.selectedImage;
      const fileName = SellerClass.saveFoodImage(imageFile);
      const checkSeller = await Seller.findOne(
        {
          userId: userId,
        },
        {
          _id: 1,
        }
      );
      let saveFood = new FoodItem({
        sellerId: checkSeller?._id,
        foodName: foodName,
        imgName: fileName,
        foodCategory: foodCategory,
        foodPrice: Number(foodPrice),
        beverageVolume: beverageVolume,
      });
      saveFood.save();
      return res.status(200).json({
        status: true,
        message: "Food item has been added successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/deleteFood/:sessionId?foodId={foodId}
  //Method : DELETE
  //Access : Public
  //Description : delete food item
  deleteFood = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    try {
      const foodId = req.query?.foodId;
      if (!foodId) {
        return res.status(400).json({
          status: false,
          message: "foodId is not received as a query parameter!",
        });
      }
      let checkSeller = await Seller.findOne(
        {
          userId: userId,
        },
        {
          _id: 1,
        }
      );
      if (!checkSeller) {
        return res.status(403).json({
          status: false,
          message: "This sessionId is not identified as restro partner.",
        });
      }
      const info = await FoodItem.deleteOne({
        _id: foodId,
        sellerId: checkSeller._id,
      });
      return res.status(200).json({
        status: true,
        info: info,
        message: "Food item is deleted!",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/getRestroFoods/:sessionId?skipFrom={skipFrom}&limit={limit}
  //Method : GET
  //Access : Public
  //Description : fetch foods of restro partner (skipFrom and limit are optional)
  getRestroFoods = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    try {
      let { skipFrom, limit } = req.query;
      if (!skipFrom) {
        skipFrom = "0";
      }
      if (!limit) {
        limit = "0";
      }

      const fetchFoods = await FoodItem.find(
        {
          sellerId: req.sellerId,
        },
        {},
        {
          skip: Number(skipFrom),
          limit: Number(limit),
        }
      );

      return res.status(200).json({
        status: true,
        data: fetchFoods,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/foodOrderList/:sessionId?skipFrom={skipFrom}&limit={limit}
  //Method : GET
  //Access : Public
  //Description : fetch food orders of restro partner whose restro's decision is pending
  foodOrderList = async (req: CustomRequest, res: Response) => {
    try {
      let { skipFrom, limit } = req.query;
      if (!skipFrom) {
        skipFrom = "0";
      }
      if (!limit) {
        limit = "20";
      }

      const fetchFoods = await FoodOrder.find(
        {
          sellerId: req.sellerId,
          orderStatus: true,
          sellerDecision: "pending",
        },
        {},
        {
          skip: Number(skipFrom),
          limit: Number(limit),
          sort: "-orderDateTime", // sort by decending order
        }
      );

      return res.status(200).json({
        status: true,
        data: fetchFoods,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/foodOrderHistory/:sessionId?skipFrom={skipFrom}&limit={limit}
  //Method : GET
  //Access : Public
  //Description : fetch food orders history of restro partner
  foodOrderHistory = async (req: CustomRequest, res: Response) => {
    try {
      let { skipFrom, limit } = req.query;
      if (!skipFrom) {
        skipFrom = "0";
      }
      if (!limit) {
        limit = "20";
      }

      const fetchFoods = await FoodOrder.find(
        {
          sellerId: req.sellerId,
          orderStatus: true,
        },
        {},
        {
          skip: Number(skipFrom),
          limit: Number(limit),
          sort: "-orderDateTime", // sort by decending order
        }
      );

      return res.status(200).json({
        status: true,
        data: fetchFoods,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/getRestroStatus/:sessionId
  //Method : GET
  //Access : Public
  //Description : fetch restro partner availability (active status)
  getRestroStatus = async (req: CustomRequest, res: Response) => {
    try {
      const getStatus = await Seller.findOne(
        {
          _id: req.sellerId,
        },
        {
          activate: 1,
        }
      );
      return res.status(200).json({
        status: true,
        activate: getStatus.activate,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/updateRestroStatus
  //Method : PUT
  //Access : Public
  //Description : change restro partner availability (active status)
  updateRestroStatus = async (req: CustomRequest, res: Response) => {
    try {
      const getStatus = await Seller.findOne(
        {
          _id: req.sellerId,
        },
        {
          activate: 1,
        }
      );
      await Seller.updateOne(
        {
          _id: req.sellerId,
        },
        {
          $set: {
            activate: !getStatus.activate,
          },
        }
      );
      return res.status(200).json({
        status: true,
        activate: !getStatus.activate,
        message: "Updated Restro Status",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /restro/restroOrderDecision
  //Method : PUT
  //Access : Public
  //Description : Take decision(by resto partner) of food ordered by users
  restroOrderDecision = async (req: CustomRequest, res: Response) => {
    try {
      const {
        restroDecision, // restro partner decision
        orderId, // food order id
      }: {
        restroDecision: "accepted" | "rejected" | undefined;
        orderId: string | undefined;
      } = req.body;

      if (!restroDecision || !orderId) {
        return res.status(400).json({
          status: false,
          message: "Some fields are missing in payload!",
        });
      }

      await FoodOrder.updateOne(
        {
          _id: orderId,
        },
        {
          $set: {
            sellerDecision: restroDecision,
          },
        }
      );

      return res.status(200).json({
        status: true,
        message: "food order has been updated by restro's decision!",
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

export default new SellerController();
