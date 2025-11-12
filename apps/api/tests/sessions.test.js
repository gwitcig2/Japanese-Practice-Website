import request from "supertest";
import app from "../src/app.js";
import { afterAll, describe, expect, test } from "vitest";

import User from "../src/models/User.js";
import jwt from "jsonwebtoken";

import { validateJWTs } from "./sharedTests.js";

let dbUser;
let userId;
let jwtToken;
let refreshCookie;

const testUser = {
    email: "iAmTest2@example.com",
    username: "theBestTester2",
    password: "KoreWaPasswordDa",
};

afterAll(async () => {

    if (dbUser) {
        await User.findByIdAndDelete(dbUser._id);
    }

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
                identifier: "iAmTest2@example.com",
                password: "KoreWaPasswordDa"
            })
            .expect(200);

        await validateJWTs(dbUser, res);

        refreshCookie = res.headers["set-cookie"].find(c => c.startsWith("refreshToken="));

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
                identifier: "theBestTester2",
                password: "ICantRememberIfThisIsMyPasswordOrNot",
            })
            .expect(401);

    });

    test("PUT /sessions returns a new valid access JWT and cycles the refresh JWT", async () => {

        const res = await request(app)
            .put("/sessions")
            .set("Cookie", refreshCookie.split(";")[0])
            .expect(200);

       await validateJWTs(dbUser, res);

        refreshCookie = res.headers["set-cookie"].find(c => c.startsWith("refreshToken="));

        jwtToken = res.body.accessToken;

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