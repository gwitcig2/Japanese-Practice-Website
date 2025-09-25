import {loginUser} from "../services/auth/loginUser.js";

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

export async function handleRefresh(req, res){

}

export async function handleLogout(req, res){

}