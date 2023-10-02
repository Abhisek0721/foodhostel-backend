import { Response, NextFunction } from "express";
import mongoStore from "../../config/mongoStore";
import CustomRequest from "../common/CustomRequestInterface";
import Seller from "../models/sellerModel";

export const verifySeller = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let sessionId =
    req.body.sessionId || req.params.sessionId || req.query.sessionId;

  
  if (!sessionId) {
    return res.status(400).json({
      auth: false,
      message: "Invalid Argument! sessionId not received!",
    });
  }

  try {
    await mongoStore.get(sessionId, async (err, session: any) => {
      if (err) {
        return res.status(500).json({
          auth: false,
          message: err?.message,
          error: err?.stack,
        });
      }
      if (session && session.user && session.user.userId) {
        const checkSeller = await Seller.exists({
          userId: session.user.userId,
        });
        if (checkSeller) {
          req.userId = session.user.userId;
          req.sellerId = checkSeller._id;
          req.phoneNumber = session.user.phoneNumber;
          req.firstName = session.user.firstName;
          req.lastName = session.user.lastName;
          return next();
        }
        return res.status(403).json({
          auth: false,
          message: "Not registered as a restro partner yet!",
        });
      }
      return res
        .status(403)
        .json({ auth: false, message: "Invalid sessionId!" });
    });
  } catch (error: any) {
    return res.status(500).json({
      auth: false,
      message: error?.message,
      error: error?.stack,
    });
  }
};
