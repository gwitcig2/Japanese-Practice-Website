import bcrypt from "bcrypt";
import User from "../../models/User.js";

/**
 * Creates a new user entry in the MongoDB given an email address and a password.
 * The password is hashed with bcrypt before going to the MongoDB.
 *
 * Returns a JSON of the new user's ID and their email.
 *
 * If a user's email already exists, throws an Error.
 *
 * @param email
 * @param password
 * @returns {Promise<{id: unknown, email: *}>}
 */
export async function signupUser(email, password) {

    const taken = await User.findOne({ email: email });
    if (taken) throw new Error("User already exists");

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email: email, password: hashPassword });
    await newUser.save();

    return { id: newUser._id, email: newUser.email };

}