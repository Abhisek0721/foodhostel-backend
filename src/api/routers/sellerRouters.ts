import express, { Request, Response, NextFunction } from "express";
import SellerController from "../controllers/SellerController";
const router = express.Router();
import { checkUser } from "../middlewares/verifyUser";
import CustomRequest from "../common/CustomRequestInterface";

const customCheckUser = (req: Request, res: Response, next: NextFunction) => {
  checkUser(req as CustomRequest, res, next);
};

router.route("/joinus").post(customCheckUser, (req: Request, res: Response) => {
  SellerController.joinus(req as CustomRequest, res);
});

export default router;
