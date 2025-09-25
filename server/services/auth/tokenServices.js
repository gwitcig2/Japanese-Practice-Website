import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/User.js";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

/**
 * Generates an access JWT for a user upon a successful signup or login.
 *
 * @param userId
 * @returns {*}
 */
export function generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: ACCESS_EXPIRES });
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

    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_KEY, { expiresIn: REFRESH_EXPIRES });
    const hashed = await bcrypt.hash(refreshToken, 10);

    await User.findByIdAndUpdate(userId, {
        $push: { refreshTokens: hashed }
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

    user.refreshTokens = user.refreshTokens.filter(
        async (hashed) => !(await bcrypt.compare(refreshToken, hashed))
    );

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
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

        const user = await User.findById(payload.userId);
        if (!user) return null;

        const isValid = await Promise.any(
            user.refreshTokens.map((hashed) => bcrypt.compare(refreshToken, hashed))
        ).catch(() => false);

        return isValid ? payload : null;

    } catch {
        return null;
    }

}