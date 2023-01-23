import mongoose from "mongoose";

const UserDeviceSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        deviceToken: { type: String },
        isLoggedIn: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const UserDevice = mongoose.model("UserDevice", UserDeviceSchema);

export default UserDevice;
