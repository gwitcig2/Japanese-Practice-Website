import request from "supertest";
import app from "../src/server.js";
import { afterAll, describe, expect, test } from "vitest";

import User from "../src/models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

let dbUser;
let userId;
let jwtToken;
let refreshCookie;

const testUser = {
    email: "iAmTest@example.com",
    username: "theBestTester",
    password: "ThisIsMyPassword",
};

afterAll(async () => {

    if (dbUser) {
        await User.findByIdAndDelete(dbUser._id);
    }

    await mongoose.disconnect();

});

describe("Sessions routes", () => {

    test("Create a test user to log in to with POST /users", async () => {

        await request(app)
            .post("/users")
            .send(testUser)
            .expect(201);

        dbUser = await User.findOne({ username: testUser.username });
        expect(dbUser).toBeDefined();

    });

    test("POST /sessions grants an access JWT in res.body, refresh JWT in an HttpOnly cookie, and gives us the user's id", async () => {

        const res = await request(app)
            .post("/sessions")
            .send({
                identifier: "iAmTest@example.com",
                password: "ThisIsMyPassword"
            })
            .expect(200);

        // Checking if the user was given a valid access JWT
        expect(res.body).toHaveProperty("accessToken");

        const verifyAccess = jwt.verify(res.body.accessToken, process.env.JWT_KEY);
        expect(verifyAccess).toBeDefined();
        expect(verifyAccess.userId === dbUser._id.toString()).toBe(true);

        // Verifying the un-hashed refresh JWT is in an HttpOnly cookie
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();

        refreshCookie = cookies.find(c => c.startsWith("refreshToken="));
        expect(refreshCookie).toBeDefined();

        // Confirming that the refresh JWT has the expected key and is tied to the test user
        const refreshToken = refreshCookie
            .split(";")[0]
            .split("=")[1];

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
        expect(payload).toHaveProperty("userId");
        expect(payload.userId === dbUser._id.toString()).toBe(true);

        // Checking if the hashed refresh JWT was added to the user's refreshTokens array
        expect(dbUser.refreshTokens).toBeInstanceOf(Array);
        expect(dbUser.refreshTokens.length).toBeGreaterThan(0);

        // Verifying that the hashed refresh JWT in the DB is equal to the real refresh JWT
        expect(await bcrypt.compare(refreshToken, dbUser.refreshTokens[0])).toBe(true);

        // Making the access JWT global so we can do unit tests with proper authorization for the other /users API requests
        jwtToken = res.body.accessToken;

    });

    test("POST /sessions returns code 400 if its given input doesn't follow the Zod schema's constraints", async () => {
        await request(app)
            .post("/sessions")
            .send({
                identifier: "youWillGrantMeEntryOrElse",
                password: "IMeanIfIHAVEtoHaveAPasswordSoBeIt",
            })
            .expect(400);
    });

    test("POST /sessions returns code 404 if it cannot find a given identifier", async () => {
        await request(app)
            .post("/sessions")
            .send({
                identifier: "notARealDB",
                password: "notARealPasswordEither!",
            })
            .expect(404);
    });

    test("POST /sessions returns code 401 if the wrong password is entered for the test user", async () => {

        await request(app)
            .post("/sessions")
            .send({
                identifier: "theBestTester",
                password: "ICantRememberIfThisIsMyPasswordOrNot",
            })
            .expect(401);

    });

    test("PUT /sessions returns a new valid access JWT", async () => {

        const res = await request(app)
            .put("/sessions")
            .set("Cookie", refreshCookie.split(";")[0])
            .expect(200);

        expect(res.body.accessToken).toBeDefined();

        const verifyAccess = jwt.verify(res.body.accessToken, process.env.JWT_KEY);
        expect(verifyAccess).toBeDefined();
        expect(verifyAccess.userId === dbUser._id.toString()).toBe(true);

    });

    test("PUT /sessions returns code 401 if it's not given a refresh JWT", async () => {

        await request(app)
            .put("/sessions")
            .expect(401);

    });

    test("PUT /sessions returns code 401 if it's given an invalid key in a refresh JWT", async () => {

        const susToken = jwt.sign({ userId }, "imREALLYhopingThisIsTheRightKey", { expiresIn: "7d" });

        await request(app)
            .put("/sessions")
            .set("Cookie", "refreshToken=" + susToken)
            .expect(401);

    });

    test("DELETE /sessions revokes the refresh token, and PUT /sessions returns code 401 to confirm the loss of access", async () => {

        await request(app)
            .delete("/sessions")
            .set("Cookie", refreshCookie.split(";")[0])
            .expect(204);

        const checkDB = await User.findById(dbUser._id);
        expect(checkDB.refreshTokens).toBeDefined();
        expect(checkDB.refreshTokens.length).toBe(0);

        await request(app)
            .put("/sessions")
            .set("Cookie", refreshCookie.split(";")[0])
            .expect(401);

    });
});