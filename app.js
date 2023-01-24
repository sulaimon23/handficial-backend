const express = require("express");
const helmet = require("helmet");
const { ErrorResponseObject } = require("./common/http");
const routes = require("./routes");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

//
//
connectDB();
const app = express();
//
//
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
//
//
//
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(helmet());
app.use("/", routes);

// default catch all handler
app.all("*", (req, res) =>
    res.status(404).json(new ErrorResponseObject("route not defined"))
);

module.exports = app;
