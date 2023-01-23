const mongoose = require("mongoose");
import { env } from "./index";

//
//
const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        process.exit(1);
    }
};

module.exports = connectDB;
