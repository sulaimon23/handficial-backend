import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const { Schema } = mongoose;

const coordinatesSchema = mongoose.Schema({
    lat: Number,
    lng: Number,
});

const LocationSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        coordinates: coordinatesSchema,
    },
    { timestamps: true }
);

LocationSchema.set("versionKey", "version");
LocationSchema.plugin(updateIfCurrentPlugin);

const Location = mongoose.model("Location", LocationSchema);

export default Location;
