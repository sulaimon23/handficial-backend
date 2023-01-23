const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        fullName: { type: String, required: "{PATH} is required" },
        email: { type: String, required: "{PATH} is required", unique: true },
        password: { type: String, required: "{PATH} is required" },
        isArtisan: { type: Boolean, required: true },
        gender: { type: String, required: false, enum: ["male", "female"] },
        profession: {
            type: String,
            required: this.isArtisan,
            enum: ["male", "female"],
        },
        status: {
            type: String,
            required: true,
            enum: ["active", "inactive"],
            default: "active",
        },
        deviceToken: {
            type: String,
        },
        phone: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: { phone: { $type: "string" } },
            },
            default: null,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        isVerified: { type: Boolean, default: false },
        wallet: {
            balance: {
                type: Number,
                default: 0,
            },
            isActive: {
                type: Boolean,
                default: true,
            },
        },
        icon: {
            type: String,
            default: process.env.DEFAULT_CATEGORY_ICON,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
