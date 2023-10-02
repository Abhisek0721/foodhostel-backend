import properties from "../../config/properties";
import CustomRequest from "../common/CustomRequestInterface";
import Razorpay from "razorpay";

class FoodOrderClass {
  public static createRazorpayPaymentLink = async (
    req: CustomRequest,
    foodName: string,
    foodPrice: number
  ) => {

    const razorpayInstance = new Razorpay({
      key_id: properties.RAZORPAY_KEY_ID,
      key_secret: properties.RAZORPAY_KEY_SECRET
    });

    const razorpayResponse = await razorpayInstance.paymentLink.create({
      amount: foodPrice,
      currency: "INR",
      description: `Food Name: ${foodName}`,
      customer: {
        name: `${req.firstName} ${req.lastName}`,
        contact: req.phoneNumber,
      },
      notify: {
        sms: true,
        email: true
      },
      callback_url: properties.CLIENT_URL,
      callback_method: "get"
    });

    return razorpayResponse
  };

  public static fetchRazorpayPayment = async (paymentId:string) => {
    const razorpayInstance = new Razorpay({
      key_id: properties.RAZORPAY_KEY_ID,
      key_secret: properties.RAZORPAY_KEY_SECRET
    });
    const razorpayResopnse = await razorpayInstance.payments.fetch(paymentId);
    
    return razorpayResopnse;
  }
}

export default FoodOrderClass;
