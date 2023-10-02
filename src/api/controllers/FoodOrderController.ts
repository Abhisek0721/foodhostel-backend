import { Request, Response } from "express";
import CustomRequest from "../common/CustomRequestInterface";
import FoodOrder from "../models/foodOrderModel";
import Seller, { ISeller } from "../models/sellerModel";
import axios from "axios";
import FoodOrderClass from "../classes/FoodOrderClass";

class FoodOrderController {
  //API : /foodorder/createOrder
  //Method : POST
  //Access : Public
  //Description : create food order
  createOrder = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    try {
      // fetch food details
      let foodName: string = req.body.foodName;
      let foodPrice: number = Number(req.body.foodPrice); // food price
      let qty: number = Number(req.body.qty); // food quantity
      let sellerId: string = req.body.sellerId; // sellerId (id of restro partner)
      let foodId: string = req.body.foodId; // food id
      let addedItems: [Object] = req.body.with; // added items details
      let {
        pincode,
        buildingName,
        roadName,
        city,
        state,
      }: {
        pincode: string;
        buildingName: string;
        roadName: string;
        city: string;
        state: string;
      } = req.body.deliveryAddress; // address of customer

      if (
        !foodName ||
        !foodId ||
        !foodPrice ||
        !qty ||
        !sellerId ||
        !pincode ||
        !buildingName ||
        !roadName ||
        !city
      ) {
        return res.status(400).json({
          status: false,
          message: "Some fields are missing payload!",
        });
      }

      const razorpayResponse = await FoodOrderClass.createRazorpayPaymentLink(
        req,
        foodName,
        foodPrice * 100 // In paise
      );

      if (razorpayResponse?.id) {
        let foodOrder = new FoodOrder({
          userId: userId,
          sellerId: sellerId,
          foodId: foodId,
          razorpayPaymentLinkId: razorpayResponse.id,
          Qty: qty,
          addedItems: addedItems,
          deliveryAddress: {
            pincode: pincode,
            buildingName: buildingName,
            roadName: roadName,
            city: city,
            state: state,
          },
          foodPrice: foodPrice,
        });
        foodOrder.save();

        return res.status(200).json({
          status: true,
          redirect: razorpayResponse.short_url,
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "Some technical issue with payment gateway!",
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /foodorder/orderSuccess
  //Method : PUT
  //Access : Public
  //Description : update order data of successful payment
  orderSuccess = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    try {
      const {
        razorpayPaymentLinkId,
        razorpayPaymentId,
        paymentStatus,
      }: {
        razorpayPaymentLinkId: string | undefined;
        razorpayPaymentId: string | undefined;
        paymentStatus: boolean | undefined;
      } = req.body;

      if (!paymentStatus) {
        return res.status(200).json({
          status: false,
          message: "Payment failed!",
        });
      }

      if (!razorpayPaymentId || !razorpayPaymentLinkId) {
        return res.status(400).json({
          status: false,
          message: "Some fields are missing in payload!",
        });
      }

      const razorpayResponse = await FoodOrderClass.fetchRazorpayPayment(
        razorpayPaymentId
      );
      if (razorpayResponse.status !== "captured") {
        return res.status(200).json({
          status: false,
          message: "You payment is either failed or will be refunded!",
        });
      }

      await FoodOrder.updateOne(
        {
          userId: userId,
          razorpayPaymentLinkId: razorpayPaymentLinkId,
        },
        {
          $set: {
            orderStatus: true,
            razorpayPaymentId: razorpayPaymentId,
          },
        }
      );

      return res.status(200).json({
        status: true,
        message: "Food Order is successful!",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };
}

export default new FoodOrderController();
