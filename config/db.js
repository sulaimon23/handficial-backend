const mongoose = require("mongoose");
require("dotenv").config();

//
//
const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        process.exit(1);
    }
};

module.exports = connectDB;
