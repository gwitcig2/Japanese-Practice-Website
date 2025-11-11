import {loginUser} from "../services/user/loginUser.js";
import {
    generateAccessToken,
    generateRefreshToken,
    revokeRefreshToken,
    verifyRefreshToken
} from "../services/jwt/jwtServices.js";
import jwt from "jsonwebtoken";
import { loginFormSchema } from "@kanpeki/form-schemas";
import {ZodError} from "zod";
import { env } from "../config/env-config.js";

/**
 * Handles logging a user in to the website and giving them a valid JWT token if authorized.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function login(req, res){

    try {
        const validLogin = loginFormSchema.parse(req.body);
        const { identifier, password } = validLogin;
        const user = await loginUser(identifier, password);

        const accessToken = generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
        });

        res.status(200).json({ accessToken });

    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: err.message });
        }

        if (err.status) {
            res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: "Login failed", details: err.message });
    }

}

/**
 * Handles verifying that a user has a valid refresh JWT, and if they do, issues them a new access JWT.
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function handleRefresh(req, res){

    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        const payload = await verifyRefreshToken(refreshToken);
        if (!payload) return res.sendStatus(401);

        const newAccessToken = generateAccessToken(payload.userId);
        return res.status(200).json({ accessToken: newAccessToken});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/**
 * Handles a user's logout request by revoking their refresh JWT, if it exists, and clearing the refreshToken cookie.
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function handleLogout(req, res){

    try {

        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const payload = jwt.decode(refreshToken);
            if (payload) {
                await revokeRefreshToken(payload.userId, refreshToken);
            }
        }

        res.clearCookie("refreshToken");
        return res.sendStatus(204);

    } catch (err) {
        if (err.status) {
            res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });
    }

}