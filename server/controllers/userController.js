import {createUser} from "../services/auth/createUser.js";
import {loginUser} from "../services/auth/loginUser.js";
import {deleteUser} from "../services/auth/deleteUser.js";

/**
 * Handles creating a user's account and adding it to the MongoDB.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function signup(req, res){

    try {
        const { email, username, password } = req.body;
        const result = await createUser(email, username, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: `Account creation error: ${error.message}` });
    }

}

/**
 * Handles logging a user in to the website and giving them a valid JWT token if authorized.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function login(req, res){

    try {
        const { email, username, password } = req.body;
        const result = await loginUser(email, username, password);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: "Login failed", details: err.message });
    }

}

/**
 * Handles a user's request to delete their account, ensuring they have a valid JWT
 * and are making the request themselves.
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function handleDeleteUser(req, res){

    try {
        if (req.user.userId !== req.params.id) {
            return res.status(403).json({ error: "Unauthorized." });
        }
        const result = await deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }

}