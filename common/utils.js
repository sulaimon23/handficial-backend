import crypto from "crypto";
import mongoose from "mongoose";
import { log } from "debug";
import UserDevice from "../components/user/userDeviceModel";
import firebase from "../service/firebase";
import Notification from "../components/user/notificationModel";
import asyncHandler from "../middleware/async";

/**
 * Send Response
 * @param {object} res express response Object
 * @param {number} statusCode HTTP status code
 * @param {string} status Status type ('success'||''error')
 * @param {string} message info to the user
 * @param {object} data object of data for user
 */
export const ResMsg = (res, statusCode = 200, status, message, data = null) => {
    res.status(statusCode).json({
        status,
        message,
        data,
    });
};

/**
 * EncryptPassword
 * @param {string} password String to be encrypted
 */
export const EncryptPassword = async (password) =>
    new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(8).toString("hex");

        crypto.scrypt(password, salt, 64, (err, hashPassword) => {
            if (err) reject(err);
            resolve(`${salt}:${hashPassword.toString("hex")}`);
        });
    });

/**
 * Compare Password
 * @param {string} password input string by user
 * @param {string} hash saved hashed password
 * @returns {boolean} true if password match hash and otherwise
 */
export const verifyPassword = (password, hash) =>
    new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":");
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key === derivedKey.toString("hex"));
        });
    });

export const saveNotification = asyncHandler(async (notifications = []) => {
    if (notifications.length > 0) {
        const data = notifications.map((item) => {
            const { userId, title, message, type = "general" } = item;
            return {
                updateOne: {
                    filter: {
                        userId: mongoose.Types.ObjectId(userId),
                        data: { title, message },
                        type,
                    },
                    update: { $set: { isSeen: false } },
                    upsert: true,
                },
            };
        });

        await Notification.bulkWrite(data);
    }
});

export const sendNotification = async (
    userId,
    title,
    message,
    type = "general",
    imageUrl = null
) => {
    saveNotification([{ userId, title, message, type }]);
    const getTokens = await UserDevice.find({ userId, isLoggedIn: true });
    const tokens = getTokens.map((el) => el.deviceToken);
    if (imageUrl) {
        const response = await firebase.messaging().sendMulticast({
            tokens,
            notification: {
                title,
                body: message,
                imageUrl,
            },
        });
        log(`${response.successCount} messages were sent successfully`);
        return response;
    }
    const response = await firebase.messaging().sendMulticast({
        tokens,
        notification: {
            title,
            body: message,
        },
    });
    log(`${response.successCount} messages were sent successfully`);
    return response;
};

export const generateOTP = () => {
    // Declare a digits variable
    // which stores all digits
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

export const getExpiryTime = (minutes) => {
    const currentDate = new Date();
    const expiry = new Date(currentDate.getTime() + minutes * 60000);
    return expiry;
};
