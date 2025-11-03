import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    /**
     * Unique email for a user. Can be used to login.
     * Must follow the regex for emails.
     */
    email: { type: String, required: true, unique: true },
    /**
     * Unique username for the user. Can be used to login.
     * Development-wise it'd be used to make URLs look prettier.
     * Can't have
     */
    username: { type: String, required: true, unique: true },
    /**
     * Stores a user's password hashed with bcrypt.
     */
    password: { type: String, required: true },
    /**
     * Stores hashed refresh tokens so that a user can be automatically
     * logged in on multiple devices, then logged out once the refresh token
     * expires.
     */
    refreshTokens: {
        type: [String],
        default: []
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;