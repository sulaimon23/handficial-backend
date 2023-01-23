import mongoose from "mongoose";

const OTPSchema = mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiry: { type: Date },
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;
