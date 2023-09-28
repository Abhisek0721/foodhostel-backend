import dotenv from "dotenv";

dotenv.config();

interface propertiesInterface {
  PORT: number; // in development
  SERVER_URL: string;
  MONGO_URI: string;
  AES_SECRET: string;
  SESSION_SECRET: string;
  REDIS_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
}

const properties: propertiesInterface = {
  PORT: Number(process.env.PORT) || 3000,

  SERVER_URL:
    process.env.SERVER_URL ||
    `https://authenticator-api-production-8231.up.railway.app`,

  MONGO_URI:
    process.env.MONGO_URI ||
    `mongodb+srv://foodime:Foodhostel0708@cluster0.rkqjved.mongodb.net/foodhostel`,

  AES_SECRET: process.env.AES_SECRET || `gsoifhkmnx0wqqbhbxzmbwe`,

  SESSION_SECRET: process.env.SESSION_SECRET || `pwegpbpqxzslgfamnx`,

  REDIS_PASSWORD: "@Abhi0721",

  REDIS_HOST: "localhost",

  REDIS_PORT: 6379,
};

export default properties;
