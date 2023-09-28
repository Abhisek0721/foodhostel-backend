import mongoose, { ConnectOptions } from "mongoose";

interface DbConnectOptions extends ConnectOptions {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
}

// connect with database
const connectDB = async (mongoUri:string) => {
    const db_config_objec:DbConnectOptions = { useNewUrlParser: true, useUnifiedTopology: true };
    mongoose
        .connect(mongoUri, db_config_objec)
        .then(() => {
        console.log("Connected to Database!");
    })
    .then((err:any) => {
      if (err) {
        console.log(err);
      }
    });
};

export default connectDB;
