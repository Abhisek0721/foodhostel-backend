import { Request, Response } from "express";
import CustomRequest from "../common/CustomRequestInterface";
import Contact from "../models/contactModel";

class ContactController {
  //API : /contact/sendMessage
  //Method : POST
  //Access : Public
  //Description : anyone can contact us
  sendMessage = async (req: CustomRequest, res: Response) => {
    try {
      const {
        name,
        email,
        message,
      }: {
        name: string | undefined;
        email: string | undefined;
        message: string | undefined;
      } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          status: false,
          message: "Some fields are missing in payload!",
        });
      }

      const contact = new Contact({
        name: name,
        email: email,
        message: message,
      });
      contact.save();

      return res.status(200).json({
        status: true,
        message: "Message has been sent!",
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

export default new ContactController();
