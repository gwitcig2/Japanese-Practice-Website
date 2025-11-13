import { env } from "../src/config/env-config.js";
import { expect } from "vitest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * For functions that are supposed to return valid authorization to a user,
 * this function tests if `res` properly includes the access JWT in `res.body`
 * and the refresh JWT as an HttpOnly cookie.
 *
 * @param dbUser
 * @param res
 */
export async function validateJWTs(dbUser, res) {

    expect(dbUser).toBeDefined();
    expect(dbUser).toHaveProperty("_id");
        
    let accessToken;
    let refreshToken;

    expect(res).toBeDefined();
    expect(res.body).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
           
    accessToken = res.body.accessToken;
           
    /*
        Note: This cookie is httpOnly=true, secure=false, and sameSite=lax. In production, httpOnly=true, secure=true
        and sameSite=strict. For testing, secure=false and sameSite=lax are necessary so we can actually access the
        cookie and verify it's storing the right JWT.
    */
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const refreshCookie = cookies.find(c => c.startsWith("refreshToken="));
    expect(refreshCookie).toBeDefined();

    refreshToken = refreshCookie
        .split(";")[0]
        .split("=")[1];

    const verifyAccess = jwt.verify(accessToken, env.ACCESS_KEY);
    expect(verifyAccess).toBeDefined();
    expect(verifyAccess.userId === dbUser._id.toString()).toBe(true);

    const verifyRefresh = jwt.verify(refreshToken, env.REFRESH_KEY);
    expect(verifyRefresh).toHaveProperty("userId");
    expect(verifyRefresh.userId === dbUser._id.toString()).toBe(true);

    expect(dbUser.refreshTokens).toBeInstanceOf(Array);
    expect(dbUser.refreshTokens).toHaveLength(1);

    expect(dbUser.refreshTokens[0]).toBeDefined();
    expect(dbUser.refreshTokens[0].tokenHash).toBeDefined();
    expect(typeof dbUser.refreshTokens[0].tokenHash === "string").toBe(true);
    expect(dbUser.refreshTokens[0].expiresAt).toBeDefined();
    expect(dbUser.refreshTokens[0].expiresAt).toBeInstanceOf(Date);

    const dbTokenHash = dbUser.refreshTokens[0].tokenHash;

    // We want this to be false to confirm the refreshToken stored in dbUser.refreshTokens[0] is indeed hashed
    expect(JSON.stringify(refreshToken) === JSON.stringify(dbTokenHash)).toBe(false);

    expect(await bcrypt.compare(refreshToken, dbTokenHash)).toBe(true);

}