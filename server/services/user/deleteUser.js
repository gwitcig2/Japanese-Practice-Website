import User from "../../models/User.js";
import mongoose from "mongoose";

/**
 * Removes a user from the DB given their `_id` from MongoDB. Authorization for this request
 * is done in `userRouter.js` with the `authenticateJWT` function.
 *
 * @param userId
 * @returns {Promise<{message: string}>}
 */
export async function deleteUser(userId) {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) throw new Error("Could not find user");
    return { message: "Account deleted!" };
}