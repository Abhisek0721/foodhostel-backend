import { Request, Response } from "express";
import CustomRequest from "../common/CustomRequestInterface";
import FoodItem from "../models/foodItemModel";
import Seller, { ISeller } from "../models/sellerModel";

class FoodItemController {
    //API : /fooditem/showFoodItems?pincode={pincode}
    //Method : GET
    //Access : Public
    //Description : fetch food items
    showFoodItems = async (req: Request, res: Response) => {
        try {
            const showCategory = ['Briyani', 'Pizza', 'Burger', 'Rolls', 'Sandwich', 'Sweets', 'Others'];
            let pincode = req.query.pincode;
            let fetchActiveRestro = [];
            if(!pincode || pincode==='null'){
                pincode = '140307'
            }
            let fetchSellers = await Seller.find(
                {
                    activate: true,
                    pincode: pincode
                },
                {
                    _id: 1
                }
            );
            for(let seller of fetchSellers){
                fetchActiveRestro.push(seller._id);
            }
            let fetchFoodItems = await FoodItem.find(
                {
                    sellerId: {$in: fetchActiveRestro},
                    foodCategory: {$in: showCategory}
                }
            );
            return res.status(200).json({
                status: true,
                data: fetchFoodItems
            });
        } catch (error:any) {
            return res.status(500).json({
                status: false,
                message: error?.message,
                error: error?.stack,
            });
        }
    }

    //API : /fooditem/showFilteredFoodItems?pincode={pincode}&category={category}
    //Method : GET
    //Access : Public
    //Description : fetch filtered food items
    showFilteredFoodItems = async (req: Request, res: Response) => {
        try {
            let pincode = req.query.pincode;
            let category = req.query.category;
            let fetchActiveRestro = [];
            if(!pincode || pincode===null){
                pincode = '140307'
            }
            let fetchSellers = await Seller.find(
                {
                    activate: true,
                    pincode: pincode
                },
                {
                    _id: 1
                }
            );
            for(let seller of fetchSellers){
                fetchActiveRestro.push(seller._id);
            }
            let fetchFoodItems = await FoodItem.find(
                {
                    sellerId: {$in: fetchActiveRestro},
                    foodCategory: category
                }
            );
            return res.status(200).json({
                status: true,
                data: fetchFoodItems
            });
        } catch (error:any) {
            return res.status(500).json({
                status: false,
                message: error?.message,
                error: error?.stack,
            });
        }
    }

    //API : /fooditem/searchFood?pincode={pincode}&text={text}
    //Method : GET
    //Access : Public
    //Description : search food items
    searchFood = async (req: Request, res: Response) => {
        try {
            let { 
                pincode,
                text
            } = req.query;

            let regex = new RegExp(text.toString(),'i');
            let showCategory = ['Briyani', 'Pizza', 'Burger', 'Rolls', 'Sandwich', 'Sweets', 'Others'];
            let fetchActiveRestro = [];

            let fetchSellers = await Seller.find(
                {
                    activate: true,
                    pincode: pincode
                },
                {
                    _id: 1
                }
            );
            for(let seller of fetchSellers){
                fetchActiveRestro.push(seller._id);
            }
            let fetchFoodItems = await FoodItem.find(
                {
                    sellerId: {$in: fetchActiveRestro},
                    foodCategory: {$in : showCategory},
                    $or: [
                        {foodName: regex},
                        {foodCategory:regex}
                    ]
                }
            );
            
            return res.status(200).json({
                status: true,
                data: fetchFoodItems
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error?.message,
                error: error?.stack,
            });
        }
    }
}

export default new FoodItemController();