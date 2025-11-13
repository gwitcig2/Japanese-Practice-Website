import mongoose from "mongoose";

export const refreshTokenSchema = new mongoose.Schema({
    tokenHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
});