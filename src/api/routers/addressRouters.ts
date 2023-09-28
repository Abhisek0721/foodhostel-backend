import express, { Request, Response, NextFunction } from "express";
import AddressController from "../controllers/AddressController";
const router = express.Router();
import { checkUser } from "../middlewares/verifyUser";
import CustomRequest from "../common/CustomRequestInterface";

const customCheckUser = (req: Request, res: Response, next: NextFunction) => {
  checkUser(req as CustomRequest, res, next);
};

router
  .route("/getlocation/:sessionId")
  .get(customCheckUser, (req: Request, res: Response) => {
    AddressController.getLocation(req as CustomRequest, res);
  });

router
  .route("/setlocation")
  .post(customCheckUser, (req: Request, res: Response) => {
    AddressController.setLocation(req as CustomRequest, res);
  });

export default router;
