import express, { Request, Response, NextFunction, response } from "express";
import FoodItemController from "../controllers/FoodItemController";
const router = express.Router();
import { checkUser } from "../middlewares/verifyUser";
import CustomRequest from "../common/CustomRequestInterface";

const customCheckUser = (req: Request, res: Response, next: NextFunction) => {
  checkUser(req as CustomRequest, res, next);
};

router.route("/showFoodItems").get(FoodItemController.showFoodItems);

router.route("/searchFood").get(FoodItemController.searchFood);

export default router;
