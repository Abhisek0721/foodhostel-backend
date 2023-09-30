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

router
  .route("/getRestroDetails/:sessionId")
  .get(customCheckUser, (req: Request, res: Response) => {
    SellerController.getRestroDetails(req as CustomRequest, res);
  });

router
  .route("/addFood")
  .post(customCheckUser, (req: Request, res: Response) => {
    SellerController.addFood(req as CustomRequest, res);
  });

router
  .route("/deleteFood/:sessionId")
  .delete(customCheckUser, (req: Request, res: Response) => {
    SellerController.deleteFood(req as CustomRequest, res);
  });


export default router;
