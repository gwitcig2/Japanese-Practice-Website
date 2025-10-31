import User from "../../models/User.js";
import bcrypt from "bcrypt";

/**
 * Updates a user's email, username, and/or password.
 *
 * @param userId
 * @param email
 * @param username
 * @param password
 */
export async function updateUser(userId, email, username, password) {

    try {

        const toUpdate = {};

        if (email) toUpdate.email = email;
        if (username) toUpdate.username = username;
        if (password) {
            toUpdate.password = await bcrypt.hash(password, 10);
        }

        const dupe = await User.findOne({ _id: userId }).lean();

        if (dupe.email === email || dupe.username === username) {
            const error = new Error();
            error.code = 11000;
            throw error;
        }

        return User.findOneAndUpdate(
            { _id: userId },
            { $set: toUpdate },
            { returnDocument: 'after', runValidators: true }
        ).select("-password");

    } catch (err) {

        if (err.code === 11000) {

            let errMessage;

            if (email !== undefined) {
                errMessage = "Email already exists";
            } else if (username !== undefined) {
                errMessage = "Username already exists";
            } else {
                errMessage = "An existing email or username already exists";
            }

            const error = new Error(errMessage);
            error.status = 409;
            throw error;
        }

        throw err;
    }

}