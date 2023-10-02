import express from "express";
import FoodItemController from "../controllers/FoodItemController";
const router = express.Router();

router.route("/showFoodItems").get(FoodItemController.showFoodItems);

router.route("/showFilteredFoodItems").get(FoodItemController.showFilteredFoodItems);

router.route("/searchFood").get(FoodItemController.searchFood);

router.route("/showBeverages").get(FoodItemController.showBeverages);

export default router;
