import express from "express";

// import { forgotPassword, login, logOut, resetPassword, signUp } from ".";
import { login } from ".";
// import { resetPwdValidation, validate } from "../../helpers/validation";
// import { verifyAdmin } from "../../middleware/auth";

// import {
//     adminChangePassword,
//     adminInit,
//     adminLogin,
// } from "../admin/authController";

const Router = express.Router();

// Router.post("/signup", signUp);
Router.get("/login", login);
// Router.post("/logout", logOut);
// Router.post("/forgotPwd", forgotPassword);
// Router.post("/resetPwd", resetPwdValidation(), validate, resetPassword);

// Router.post("/admin/init", adminInit);
// Router.post("/admin/login", adminLogin);
// Router.patch("/admin/change-password", verifyAdmin, adminChangePassword);
module.exports = Router;
