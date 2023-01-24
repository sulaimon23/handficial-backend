import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

/*
    data field: obejct inteface
    {
        message: '',
    }
*/

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        notifierId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        type: {
            type: String,
            enum: ["general", "comment", "credit", "invite", "follow"],
            default: "general",
        },
        data: { type: mongoose.Schema.Types.Mixed },
        isSeen: { type: Boolean, default: false },
    },
    { timestamps: true }
);

notificationSchema.set("versionKey", "version");
notificationSchema.plugin(updateIfCurrentPlugin);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
