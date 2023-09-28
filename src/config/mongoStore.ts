import MongoStore from "connect-mongo";
import properties from "./properties";

const mongoStore = MongoStore.create(
    {
        mongoUrl: properties.MONGO_URI,
        ttl: 14 * 24 * 60 * 60, // = 14 days. Default
        dbName: "foodhostel",
        collectionName: "sessions",
        crypto: {
            secret: properties.AES_SECRET,
        }
    }
);

export default mongoStore;