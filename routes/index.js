const { Router } = require("express");
const { SuccessResponseObject } = require("../common/http");
const auth = require("./auth/authRoutes");

const res = Router();

res.use("/auth", auth);

res.get("/", (req, res) =>
    res.json(new SuccessResponseObject("express vercel boiler plate"))
);

module.exports = res;
