import express, { Request, Response, NextFunction } from "express";
import UserController from "../controllers/UserController";
const router = express.Router();
import { checkUser } from "../middlewares/verifyUser";
import CustomRequest from "../common/CustomRequestInterface";

const customCheckUser = (req: Request, res: Response, next: NextFunction) => {
  checkUser(req as CustomRequest, res, next);
};

router.route("/signup").post(UserController.signup);

router.route("/login").post(UserController.login);

router
  .route("/getProfile/:sessionId")
  .get(customCheckUser, (req: Request, res: Response) => {
    UserController.getProfile(req as CustomRequest, res);
  });

router
  .route("/verifyToken/:sessionId")
  .get(customCheckUser, (req: Request, res: Response) => {
    UserController.verifyToken(req as CustomRequest, res);
  });

router.route("/forgotPassword").post(UserController.forgottenPassword);

router.route("/verifyOTP").post(UserController.verifyOTP);

router
  .route("/changeForgottenPassword")
  .post(UserController.changeForgottenPassword);

export default router;
