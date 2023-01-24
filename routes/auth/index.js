/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

import { signupMessage, forgotPwdMessage, sendEmail } from "../../services";
import asyncHandler from "../../middleware/async";
import {
    EncryptPassword,
    generateOTP,
    getExpiryTime,
    ResMsg,
    verifyPassword,
} from "../../common/utils";
import Location from "../../controllers/LocationSchema";
import OTP from "../../controllers/OtpSchema";
import UserDevice from "../../controllers/UserDeviceSchema";
import User from "../../controllers/UserSchema";

//
//
export const signUp = asyncHandler(async (req, res) => {
    const { name, email, password, deviceToken, profession, isArtisan } =
        req.body;

    const chk = await User.findOne({ email: email.toLowerCase() });
    if (chk) return ResMsg(res, 400, "error", "user already exist", null);
    try {
        const encryptPwd = await EncryptPassword(password);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: encryptPwd,
            isArtisan,
            profession,
        });
        const token = await user.getSignedJwtToken();

        if (token) {
            await UserDevice.findOneAndUpdate(
                { userId: user._id, deviceToken },
                { userId: user._id, deviceToken, isLoggedIn: true },
                { upsert: true }
            );

            sendEmail({
                email,
                subject: "Welcome to Handficial!",
                message: signupMessage(), // userObject
            });

            return ResMsg(res, 201, "success", "Signup success.", {
                user,
                token,
            });
        } else {
            return ResMsg(res, 401, "error", "Invalid Token", { user, token });
        }
    } catch (error) {
        console.log(error);
    }
});

export const login = asyncHandler(async (req, res) => {
    const { email, password, deviceToken } = req.body;
    if (!deviceToken)
        return ResMsg(res, 400, "error", "no device token passed.", null);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return ResMsg(res, 404, "error", "Invalid email/password.");
    if (user.status !== "active") {
        return ResMsg(
            res,
            403,
            "error",
            "Your account has been disabled, please contact us for support.",
            null
        );
    }

    const passwordCorrect = await verifyPassword(password, user.password);
    if (!passwordCorrect)
        return ResMsg(res, 400, "error", "Invalid email/password.", null);

    const token = await user.getSignedJwtToken();

    if (deviceToken) {
        await UserDevice.findOneAndUpdate(
            { userId: user._id, deviceToken },
            { userId: user._id, deviceToken, isLoggedIn: true },
            { upsert: true }
        );
    }

    const locations = await Location.find({ userId: user._id });

    return ResMsg(res, 200, "success", "User login success.", {
        user,
        locations,
        token,
    });
});

export const logOut = asyncHandler(async (req, res) => {
    const { userId, deviceToken } = req.body;

    if (deviceToken) {
        await UserDevice.findOneAndUpdate(
            { userId, deviceToken },
            { isLoggedIn: false },
            { upsert: true }
        );
    }

    return ResMsg(res, 200, "success", "Logout success.", {});
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) return ResMsg(res, 422, "error", "email is required.", null);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return ResMsg(res, 400, "error", "email does not exist.", null);
    const otp = generateOTP();

    const expiry = getExpiryTime(20);
    console.log("otp sent", otp);
    await OTP.findOneAndUpdate(
        { email: email.toLowerCase() },
        { email: email.toLowerCase(), otp, expiry },
        { upsert: true }
    );
    console.log("want to send email ", email);
    await sendEmail({
        email,
        message: forgotPwdMessage(otp), // userObject
    });
    console.log("email sent ", email);
    return ResMsg(
        res,
        200,
        "success",
        "Verification code sent to email.",
        null
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPwd } = req.body;

    console.log(req.body);
    const verifyOtp = await OTP.findOne({
        email: email.toLowerCase(),
        otp: String(otp),
    });
    if (!verifyOtp) return ResMsg(res, 400, "error", "invalid OTP.", null);
    if (new Date() > new Date(verifyOtp.expiry))
        return ResMsg(res, 400, "error", "OTP expired.", null);

    const hash = await EncryptPassword(newPwd);
    await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { password: hash }
    );
    sendEmail({
        email,
        subject: "Password reset Successfully",
        message: forgotPwdMessage(otp), // userObject
    });

    return ResMsg(res, 200, "success", "Password reset successful.", null);
});
