import dotenv from "dotenv";

dotenv.config();

interface propertiesInterface {
  PORT: number; // in development
  SERVER_URL: string;
  CLIENT_URL: string;
  MONGO_URI: string;
  AES_SECRET: string;
  SESSION_SECRET: string;
  REDIS_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
}

const properties: propertiesInterface = {
  PORT: Number(process.env.PORT) || 3000,

  SERVER_URL: process.env.SERVER_URL || `http://localhost:3000`,

  CLIENT_URL: process.env.CLIENT_URL || `http://localhost:8080`,

  MONGO_URI:
    process.env.MONGO_URI ||
    `mongodb+srv://foodime:Foodhostel0708@cluster0.rkqjved.mongodb.net/foodhostel`,

  AES_SECRET: process.env.AES_SECRET || `gsoifhkmnx0wqqbhbxzmbwe`,

  SESSION_SECRET: process.env.SESSION_SECRET || `pwegpbpqxzslgfamnx`,

  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "@Abhi0721",

  REDIS_HOST: process.env.REDIS_HOST || "localhost",

  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || `rzp_test_74l7fOTJq7OZMi`,

  RAZORPAY_KEY_SECRET:
    process.env.RAZORPAY_KEY_SECRET || `pmBAe8uuVMZzWvdj5xCnzkZM`,
};

export default properties;
