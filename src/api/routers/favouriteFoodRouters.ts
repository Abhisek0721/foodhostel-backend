import express, { Request, Response, NextFunction } from "express";
import FavouriteFoodController from "../controllers/FavouriteFoodController";
const router = express.Router();
import { checkUser } from "../middlewares/verifyUser";
import CustomRequest from "../common/CustomRequestInterface";

const customCheckUser = (req: Request, res: Response, next: NextFunction) => {
  checkUser(req as CustomRequest, res, next);
};

router
  .route("/addToFavourite")
  .post(customCheckUser, (req: Request, res: Response) => {
    FavouriteFoodController.addToFavourite(req as CustomRequest, res);
  });

router
  .route("/deleteFavouriteFood/:sessionId")
  .delete(customCheckUser, (req: Request, res: Response) => {
    FavouriteFoodController.deleteFavouriteFood(req as CustomRequest, res);
  });

router
  .route("/getFavouriteFood/:sessionId")
  .get(customCheckUser, (req: Request, res: Response) => {
    FavouriteFoodController.getFavouriteFood(req as CustomRequest, res);
  });

export default router;
