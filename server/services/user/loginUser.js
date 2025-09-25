import User from "../../models/User.js";
import bcrypt from "bcrypt";

/**
 * Processes a user's login request via finding their account and comparing passwords.
 *
 * If successful, returns the document of the user's data.
 *
 * If no valid user is found OR the passwords don't match, throws an Error.
 *
 * @param email
 * @param username
 * @param password
 * @returns {Promise<{token: (*)}>}
 */
export async function loginUser(email, username, password) {

    const user = await User.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    });
    if (!user) throw new Error("Could not find user");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    return user;

}