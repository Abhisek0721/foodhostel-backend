import express, { Express, Request, Response } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv, { parse } from "dotenv";
import connectDB from "./src/config/dbConfig";
import properties from "./src/config/properties";
import session from "express-session";
import mongoStore from "./src/config/mongoStore";
import generateStaticDirectory from "./src/utils/createStaticDirectory";
import userRouters from "./src/api/routers/userRouters";
import addressRouters from "./src/api/routers/addressRouters";
import foodItemRouters from "./src/api/routers/foodItemRouters";
import sellerRouters from "./src/api/routers/sellerRouters";
import contactRouters from "./src/api/routers/contactRouters";
import foodOrderRouters from "./src/api/routers/foodOrderRouters";
import favouriteFoodRouters from "./src/api/routers/favouriteFoodRouters";

dotenv.config();
connectDB(properties.MONGO_URI);

const app: Express = express();

// enable this if you run behind a proxy (e.g. nginx)
app.set("trust proxy", 1);
app.use(fileUpload());
app.use(cors());
app.use(express.json());
//Configure session middleware
app.use(
  session({
    secret: properties.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 14 * 24 * 60 * 60 * 1000, // Set the cookie expiration time (in milliseconds)
    },
    store: mongoStore,
  })
);

try {
  app.use("/static", express.static("static"));
} catch (error) {
  console.log(error);
}

const port: number = Number(properties.PORT) || 3000;

app.get("*", async (req: Request, res: Response) => {
  return res.send(`<h1>Running backend on Port : ${port}</h1>`);
});

// creating static/excelsheets directories if it doesn't exists
generateStaticDirectory();

app.use("/users", userRouters);
app.use("/address", addressRouters);
app.use("/fooditem", foodItemRouters);
app.use("/restro", sellerRouters);
app.use("/contact", contactRouters);
app.use("/foodorder", foodOrderRouters);
app.use("/favourite", favouriteFoodRouters);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Open Browser: http://localhost:${port}`);
});
