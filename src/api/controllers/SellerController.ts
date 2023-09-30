import { Request, Response } from "express";
import CustomRequest from "../common/CustomRequestInterface";
import Seller from "../models/sellerModel";
// import saveFoodImages from "../../utils/imageUploadUtils";
import FoodItem from "../models/foodItemModel";
import SellerClass from "../classes/SellerClass";

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
        roadName
      }:{
        restroName: string|undefined;
        pincode: string|undefined;
        city: string|undefined;
        roadName: string|undefined;
      } = req.body;
      let checkSeller = await Seller.exists({userId: userId});

      if(!checkSeller){
        let seller = new Seller({
            userId: userId,
            activate: false,
            restroName: restroName,
            pincode: pincode,
            city: city,
            roadName: roadName
        });
        seller.save();
        return res.status(200).json({
          status: true,
          message: "Created restro account successfully!"
        });
      }

      return res.status(200).json({
        status: false,
        message: "Restro account already exists!"
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  }
  
  //API : /restro/getRestroDetails/:sessionId
  //Method : GET
  //Access : Public
  //Description : get details of restro partner
  getRestroDetails = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const checkSeller = await Seller.findOne({
        userId: userId
      });
      return res.status(200).json(
        {
          status: true,
          data: checkSeller
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  }

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
        foodPrice
      }:{
        foodName: string;
        foodCategory: 'Briyani'|'Pizza'|'Burger'|'Rolls'|'Sandwich'|'Sweets'|'Others';
        beverageVolume?: number;
        foodPrice: number|string;
      } = req.body;
      const files = req.files?.selectedImage;
      if(!files){
          return res.status(400).json({
            status: false,
            message: "File is not uploaded!"
          })
      }
      const imageFile:any = req.files?.selectedImage;
      const fileName = SellerClass.saveFoodImage(imageFile);
      const checkSeller = await Seller.findOne(
        {
          userId: userId
        },
        {
          _id: 1
        }
      );
      let saveFood = new FoodItem(
        {
          sellerId: checkSeller?._id,
          foodName: foodName,
          imgName: fileName,
          foodCategory: foodCategory,
          foodPrice: Number(foodPrice),
          beverageVolume: beverageVolume
        }
      );
      saveFood.save();
      return res.status(200).json({
        status: true,
        message: "Food item has been added successfully!"
      })
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  }

  //API : /restro/deleteFood/:sessionId?foodId={foodId}
  //Method : DELETE
  //Access : Public
  //Description : delete food item
  deleteFood = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    try {
      const foodId = req.query?.foodId;
      if(!foodId){
        return res.status(400).json(
          {
            status: false,
            message: "foodId is not received as a query parameter!"
          }
        );
      }
      let checkSeller = await Seller.findOne(
        {
          userId: userId
        },
        {
          _id: 1
        }
      );
      if(!checkSeller){
        return res.status(403).json(
          {
            status: false,
            message: "This sessionId is not identified as restro partner."
          }
        );
      }
      const info = await FoodItem.deleteOne(
        {
          _id: foodId,
          sellerId: checkSeller._id
        }
      );
      return res.status(200).json(
        {
          status: true,
          info: info,
          message: "Food item is deleted!"
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  }
}

export default new SellerController();
