import {createUser} from "../services/user/createUser.js";
import {deleteUser} from "../services/user/deleteUser.js";
import {updateUser} from "../services/user/updateUser.js";

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
 * Handles an update to a user's account details, ensuring the user has a valid JWT and is making the request themselves.
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function handleUpdateUser(req, res){

    try {
        const id = req.params.id;

        if (req.user.userId !== id) {
            return res.status(403).json({ error: "Unauthorized." });
        }

        const { email, username, password } = req.body;

        const result = await updateUser(id, email, username, password);

        res.status(200).json(result);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });
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