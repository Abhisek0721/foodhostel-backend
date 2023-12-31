import express, { Request, Response, NextFunction } from "express";
import SellerController from "../controllers/SellerController";
const router = express.Router();
import { checkUser } from "../middlewares/verifyUser";
import { verifySeller } from "../middlewares/verifySeller";
import CustomRequest from "../common/CustomRequestInterface";

const customCheckUser = (req: Request, res: Response, next: NextFunction) => {
  checkUser(req as CustomRequest, res, next);
};

const customCheckSeller = (req: Request, res: Response, next: NextFunction) => {
  verifySeller(req as CustomRequest, res, next);
};

router.route("/joinus").post(customCheckUser, (req: Request, res: Response) => {
  SellerController.joinus(req as CustomRequest, res);
});

router
  .route("/getRestroDetails/:sessionId")
  .get(customCheckSeller, (req: Request, res: Response) => {
    SellerController.getRestroDetails(req as CustomRequest, res);
  });

router
  .route("/addFood")
  .post(customCheckSeller, (req: Request, res: Response) => {
    SellerController.addFood(req as CustomRequest, res);
  });

router
  .route("/deleteFood/:sessionId")
  .delete(customCheckSeller, (req: Request, res: Response) => {
    SellerController.deleteFood(req as CustomRequest, res);
  });

router
  .route("/getRestroFoods/:sessionId")
  .get(customCheckSeller, (req: Request, res: Response) => {
    SellerController.getRestroFoods(req as CustomRequest, res);
  });

router
  .route("/foodOrderList/:sessionId")
  .get(customCheckSeller, (req: Request, res: Response) => {
    SellerController.foodOrderList(req as CustomRequest, res);
  });

router
  .route("/foodOrderHistory/:sessionId")
  .get(customCheckSeller, (req: Request, res: Response) => {
    SellerController.foodOrderHistory(req as CustomRequest, res);
  });

router
  .route("/getRestroStatus/:sessionId")
  .get(customCheckSeller, (req: Request, res: Response) => {
    SellerController.getRestroStatus(req as CustomRequest, res);
  });

router
  .route("/updateRestroStatus")
  .put(customCheckSeller, (req: Request, res: Response) => {
    SellerController.updateRestroStatus(req as CustomRequest, res);
  });

router
  .route("/restroOrderDecision")
  .put(customCheckSeller, (req: Request, res: Response) => {
    SellerController.restroOrderDecision(req as CustomRequest, res);
  });

export default router;
