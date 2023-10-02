import express, { Request, Response, NextFunction } from "express";
import FoodOrderController from "../controllers/FoodOrderController";
const router = express.Router();
import { checkUser } from "../middlewares/verifyUser";
import CustomRequest from "../common/CustomRequestInterface";

const customCheckUser = (req: Request, res: Response, next: NextFunction) => {
  checkUser(req as CustomRequest, res, next);
};

router
  .route("/createOrder")
  .post(customCheckUser, (req: Request, res: Response) => {
    FoodOrderController.createOrder(req as CustomRequest, res);
  });

router
  .route("/orderSuccess")
  .put(customCheckUser, (req: Request, res: Response) => {
    FoodOrderController.orderSuccess(req as CustomRequest, res);
  });

export default router;
