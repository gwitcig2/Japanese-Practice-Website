import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY;

/**
 * Processes a user's login request via finding their account and comparing passwords.
 *
 * If successful, returns a JSON web token consisting of the user's MongoDB id, the JWT authorization key,
 * and an expiration timer.
 *
 * If no valid user is found OR the passwords don't match, throws an Error.
 *
 * @param email
 * @param password
 * @returns {Promise<{token: (*)}>}
 */
export async function loginUser(email, password) {

    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Could not find user");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user._id}, JWT_KEY, { expiresIn: "1h"});
    return { token };

}