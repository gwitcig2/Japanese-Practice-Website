import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * Removes a user from the DB given their `_id` from MongoDB.
 *
 * @param userId
 * @returns {Promise<{message: string}>}
 */
export async function deleteUser(userId) {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) throw new Error("Could not find user");
    return { message: "Account deleted!" };
}