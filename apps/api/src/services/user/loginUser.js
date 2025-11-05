import User from "../../models/User.js";
import bcrypt from "bcrypt";

/**
 * Processes a user's login request via finding their account and comparing passwords.
 *
 * If successful, returns the document of the user's data.
 *
 * If no valid user is found OR the passwords don't match, throws an Error.
 *
 * @param identifier
 * @param password
 * @returns {Promise<{token: (*)}>}
 */
export async function loginUser(identifier, password) {

    const user = await User.findOne({
        $or: [
            { email: identifier },
            { username: identifier }
        ]
    });
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const err = new Error("Passwords do not match");
        err.status = 401;
        throw err;
    }

    return user;

}