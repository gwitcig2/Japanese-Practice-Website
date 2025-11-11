import jwt from "jsonwebtoken";
import { env } from "../config/env-config.js";

/**
 *
 * Authenticates the existence of a valid JSON web token that is given only to logged-in users.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export async function authenticateJWT(req, res, next) {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, env.ACCESS_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });

}