import express from "express";
import FoodItemController from "../controllers/FoodItemController";
const router = express.Router();


router.route("/showFoodItems").get(FoodItemController.showFoodItems);

router.route("/searchFood").get(FoodItemController.searchFood);

export default router;
