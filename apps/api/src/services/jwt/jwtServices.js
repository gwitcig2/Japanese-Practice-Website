import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/User.js";

import { env } from "../../config/env-config.js";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";
const SECONDS_TO_MS = 1000;

/**
 * Generates an access JWT for a user upon a successful signup or login.
 *
 * @param userId
 * @returns {*}
 */
export function generateAccessToken(userId) {
    return jwt.sign({ userId }, env.ACCESS_KEY, { expiresIn: ACCESS_EXPIRES });
}

/**
 * Generates a refresh JWT for a user upon a successful signup or login.
 * This allows the user to not have to log in each time they visit the site,
 * and also allows them to be logged in on multiple devices.
 *
 * @param userId
 * @returns {Promise<*>}
 */
export async function generateRefreshToken(userId) {

    const refreshToken = jwt.sign({ userId }, env.REFRESH_KEY, { expiresIn: REFRESH_EXPIRES });
    const hashed = await bcrypt.hash(refreshToken, 10);

    const decoded = jwt.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * SECONDS_TO_MS);

    await User.findByIdAndUpdate(userId, {
        $push: {
            refreshTokens: {
                tokenHash: hashed,
                expiresAt: expiresAt,
            }
        }
    });

    return refreshToken;

}

/**
 * Revokes a refresh JWT upon logout or session time expiring.
 *
 * @param userId
 * @param refreshToken
 * @returns {Promise<void>}
 */
export async function revokeRefreshToken(userId, refreshToken) {

    const user = await User.findById(userId);
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    const matches = await Promise.all(
        user.refreshTokens.map((entry) => bcrypt.compare(refreshToken, entry.tokenHash))
    );

    user.refreshTokens = user.refreshTokens.filter((_, i) => !matches[i]);

    await user.save();

}

/**
 * Checks if a user has a valid refresh JWT.
 *
 * @param refreshToken
 * @returns {Promise<*|null>}
 */
export async function verifyRefreshToken(refreshToken) {

    try {
        const payload = jwt.verify(refreshToken, env.REFRESH_KEY);
        const user = await User.findById(payload.userId);
        if (!user) return null;

        for (const entry of user.refreshTokens) {
            const match = await bcrypt.compare(refreshToken, entry.tokenHash);
            if (match) {
                if (entry.expiresAt && entry.expiresAt < new Date()) {
                    return null;
                }
                return payload;
            }
        }

        return null;

    } catch {
        return null;
    }

}