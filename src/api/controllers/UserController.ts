import { Request, Response } from "express";
import User from "../models/userModel";
// for encryption and decryption of password
import aes from "crypto-js/aes";
import CryptoJS from "crypto-js";
import properties from "../../config/properties";
import ISession from "../common/SessionInterface";
import CustomRequest from "../common/CustomRequestInterface";
// import mongoStore from "../../config/mongoStore";
import {
  redisSetOTP,
  redisGetOTP,
  redisVerifyUser,
  redisDelete,
} from "../../utils/redisOtpHandler";
import axios from "axios";

class UserController {
  //API : /users/login
  //Method : POST
  //Access : Public
  //Description : login a user
  public login = async (req: Request, res: Response) => {
    try {
      let {
        phoneNumber,
        password,
      }: {
        phoneNumber: string | undefined;
        password: string | undefined;
      } = req.body;
      if (!phoneNumber || !password) {
        return res.status(400).json({
          auth: false,
          message: "phoneNumber or password is missing!",
        });
      }

      // fetch user's data
      let user = await User.findOne(
        { 
          phoneNumber: phoneNumber 
        },
        {
          _id: 1,
          phoneNumber: 1,
          firstName: 1,
          lastName: 1,
          password: 1
        }
      );
      if (user) {
        var decryptedPassword: any = aes.decrypt(
          user.password,
          properties.AES_SECRET
        );
        decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
        if (decryptedPassword === password) {
          // Store the user data in the session
          const sessionData = req.session as unknown as ISession;
          sessionData.user = {
            userId: user._id,
            phoneNumber: phoneNumber,
            firstName: user.firstName,
            lastName: user.lastName
          };
          return res.json({
            auth: true,
            message: "Log in succussfully!",
            sessionId: req.session.id,
          });
        } else {
          return res
            .status(400)
            .json({ auth: false, message: "Wrong Password!" });
        }
      } else {
        return res
          .status(400)
          .json({ auth: false, message: "Phone Number doesn't exist!" });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /users/getProfile/:sessionId
  //Method : GET
  //Access : Public
  //Description : get a user's data
  public getProfile = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    try {
      const userData = await User.findOne(
        {
          _id: userId,
        },
        {
          _id: 0,
          password: 0,
        }
      );
      return res.status(200).json({
        status: true,
        userData: userData,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /users/verifyToken/:sessionId
  //Method : GET
  //Access : Public
  //Description : verify a user's data
  public verifyToken = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    try {
      const userData = await User.exists({
        _id: userId,
      });
      if (userData._id) {
        return res.status(200).json({
          status: true,
        });
      }
      return res.status(200).json({
        status: false,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /users/signup
  //Method : POST
  //Access : Public
  //Description : signup new user
  public signup = async (req: Request, res: Response) => {
    try {
      let {
        firstName,
        lastName,
        phoneNumber,
        password,
      }: {
        firstName: string | undefined;
        lastName: string | undefined;
        phoneNumber: string | undefined;
        password: string | undefined;
      } = req.body;
      if (!phoneNumber || !password || !firstName || !lastName) {
        return res.status(400).json({
          status: false,
          message: "Some fields are is missing in payload!",
        });
      }

      const userExists = await User.findOne({ phoneNumber: phoneNumber });
      if (userExists) {
        return res
          .status(400)
          .json({ status: false, message: "Phone Number already exist!" });
      }

      let encryptedPassword = aes
        .encrypt(password, properties.AES_SECRET)
        .toString(); // hash password

      // const sessionData = req.session as unknown as ISession;
      let generatedOTP = `${Math.floor(1000 + Math.random() * 9000)}`;
      console.log(`generatedOTP: ${generatedOTP}`);
      generatedOTP = "1111";
      const userData = {
        firstName: firstName,
        lastName: lastName,
        password: encryptedPassword,
        newUser: true,
      };
      let redisResponse = await redisSetOTP(
        generatedOTP,
        phoneNumber,
        userData
      );

      return res.json({
        status: true,
        info: redisResponse,
        message: "OTP sent successfull!",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /users/verifyOTP
  //Method : POST
  //Access : Public
  //Description : For phoneNumber verification of a user.
  public verifyOTP = async (req: Request, res: Response) => {
    try {
      let {
        phoneNumber,
        receivedOTP,
      }: {
        phoneNumber: string | undefined;
        receivedOTP: string | undefined;
      } = req.body;
      if (!phoneNumber || !receivedOTP) {
        return res.status(400).json({
          status: false,
          messsage: "phoneNumber or receivedOTP is missing!",
        });
      }

      let redisResponse = await redisGetOTP(phoneNumber);
      console.log(redisResponse);

      if (
        redisResponse.otp !== receivedOTP &&
        redisResponse.verified === "false"
      ) {
        return res.status(400).json({
          status: false,
          message: "Wrong OTP!",
        });
      }

      if (redisResponse.verified === null) {
        return res.status(400).json({
          status: false,
          message: "Wrong Phone-Number!",
        });
      }

      if (redisResponse && redisResponse.newUser === "true") {
        let user = new User({
          firstName: redisResponse.firstName,
          lastName: redisResponse.lastName,
          phoneNumber: phoneNumber,
          verified: true,
          password: redisResponse.password,
        });
        user.save();
        console.log("Created new account!");
        await redisDelete(phoneNumber);
        return res.status(200).json({
          status: true,
          message: "OTP has been verified!",
        });
      }

      if (
        redisResponse &&
        redisResponse.firstName === "" &&
        redisResponse.lastName === "" &&
        redisResponse.password === "" &&
        redisResponse.newUser === "false"
      ) {
        await redisVerifyUser(phoneNumber);
        return res.status(200).json({
          status: true,
          message: "OTP has been verified!",
        });
      }

      return res.status(200).json({
        status: false,
        message: "Please try again later!",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /users/forgotPassword
  //Method : POST
  //Access : Public
  //Description : Send OTP to change password.
  public forgottenPassword = async (req: Request, res: Response) => {
    try {
      let phoneNumber: string | undefined = req.body.phoneNumber;
      if (!phoneNumber) {
        return res.status(400).json({
          status: false,
          message: "phoneNumber is missing in payload!",
        });
      }

      let getUser = await User.findOne(
        {
          phoneNumber: phoneNumber,
        },
        {
          _id: 1,
          firstName: 1,
        }
      );
      if (!getUser) {
        return res.status(400).json({
          status: false,
          message: "No user is found with this phoneNumber!",
        });
      }

      // const sessionData = req.session as unknown as ISession;
      let generatedOTP = `${Math.floor(1000 + Math.random() * 9000)}`;
      console.log(generatedOTP);
      const userData = {
        newUser: false,
      };
      let redisResponse = await redisSetOTP(
        generatedOTP,
        phoneNumber,
        userData
      );

      return res.status(200).json({
        status: true,
        info: redisResponse,
        message: "OTP is sent to change forgotten password!",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };

  //API : /users/changeForgottenPassword
  //Method : POST
  //Access : Public
  //Description : Change forgotten password.
  public changeForgottenPassword = async (req: Request, res: Response) => {
    try {
      let {
        phoneNumber,
        newPassword,
      }: {
        phoneNumber: string | undefined;
        newPassword: string | undefined;
      } = req.body;
      if (!phoneNumber || !newPassword) {
        return res.status(400).json({
          status: false,
          message: "Some fields are missing in payload!",
        });
      }

      let redisResponse = await redisGetOTP(phoneNumber);
      if (redisResponse.verified === "true") {
        // password encryption
        let encryptedPassword = aes
          .encrypt(newPassword, properties.AES_SECRET)
          .toString(); // hash password

        // updating user's password
        await User.updateOne(
          {
            phoneNumber: phoneNumber,
          },
          {
            $set: {
              password: encryptedPassword,
            },
          }
        );
        await redisDelete(phoneNumber);
        return res.status(200).json({
          status: true,
          message: "Password has been changed!",
        });
      }

      return res.status(400).json({
        status: false,
        message: "OTP is not verified yet!",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error?.message,
        error: error?.stack,
      });
    }
  };
}

export default new UserController();
