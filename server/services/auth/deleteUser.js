import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });

}

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