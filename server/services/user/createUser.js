import bcrypt from "bcrypt";
import User from "../../models/User.js";

/**
 * Creates a new user entry in the MongoDB given an email address, username, and a password.
 * The password is hashed with bcrypt before going to the MongoDB.
 *
 * Returns a JSON of the new user's ID and their username.
 *
 * If a user's email or username already exists, throws an Error.
 *
 * @param email
 * @param username
 * @param password
 * @returns {Promise<{id: unknown, email: *}>}
 */
export async function createUser(email, username, password) {

    const takenEmail = await User.findOne({ email: email });
    if (takenEmail) throw new Error("User already exists");

    const takenUsername = await User.findOne({ username: username });
    if (takenUsername) throw new Error("User already exists");

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email: email, username: username, password: hashPassword });
    await newUser.save();

    return { userId: newUser._id, username: newUser.username };

}