import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import {expect} from "@jest/globals";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const testUser = {
    email: "iAmTest@example.com",
    username: "theBestTester",
    password: "ThisIsMyPassword",
};

const accountChanges = {
    email: "heresMyNewEmail@example.com",
    username: "theGreatestTechnicianThatsEverLived",
    password: "IHatePasswords!"
};

let jwtToken;
let dbUser;

afterAll(async () => {

    if (dbUser) {
        await User.findByIdAndDelete(dbUser._id);
    }

   await mongoose.disconnect();
});

describe("User authentication routes", () => {

    test("Signup route makes a new test user and provides them with valid access and refresh JWTs", async () => {

        const res = await request(app)
            .post("/users")
            .send(testUser)
            .expect(201);

        // Confirming if testUser's data was added to the database successfully
        dbUser = await User.findOne({ username: testUser.username });
        expect(dbUser).toBeDefined();

        // Checking if the user was given a valid access JWT
        expect(res.body).toHaveProperty("accessToken");

        const verifyAccess = jwt.verify(res.body.accessToken, process.env.JWT_KEY);
        expect(verifyAccess).toBeDefined();
        expect(verifyAccess.userId === dbUser._id.toString()).toBe(true);

        // Verifying the un-hashed refresh JWT is in an HttpOnly cookie
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();

        const refreshCookie = cookies.find(c => c.startsWith("refreshToken="));
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

        // Checking if returned user data matches their MongoDB objectId and testUser's username
        expect(res.body.user).toHaveProperty("userId");
        expect(res.body.user.userId === dbUser._id.toString()).toBe(true);

        expect(res.body.user).toHaveProperty("username");
        expect(res.body.user.username === testUser.username).toBe(true);

    });

    test("Update route changes a user's email, username, and password, and the returned doc does not contain the password", async () => {

        const res = await request(app)
            .put(`/users/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(accountChanges)
            .expect(200);

        expect(res.body.email).toBe(accountChanges.email);

        expect(res.body.username).toBe(accountChanges.username);

        expect(res.body.password).toBeUndefined();

    });

    test("Update route returns code 401 when no authorization is provided", async () => {

        await request(app)
            .put(`/users/${dbUser._id}`)
            .send(accountChanges)
            .expect(401);

    });

    test("Update route returns code 403 if a user tries updating a different account", async () => {

        await request(app)
            .put(`/users/imBouttaHackThisDudesAccountLOL`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(accountChanges)
            .expect(403);

    });

    test("Update route returns code 409 if a username or email already exists", async () => {

        const emailOnly = {
            email: "heresMyNewEmail@example.com"
        }

        await request(app)
            .put(`/users/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(emailOnly)
            .expect(409);

        const usernameOnly = {
            username: "theGreatestTechnicianThatsEverLived"
        }

        await request(app)
            .put(`/users/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(usernameOnly)
            .expect(409);

    });

    test("Delete sends a 401 if no authorization is provided", async () => {

        await request(app)
           .delete(`/users/${dbUser._id}`)
           .expect(401);
    });

    test("Delete sends a 403 error when JWT authorization is invalid ", async () => {

        await request(app)
            .delete(`/users/${dbUser._id}`)
            .set("Authorization", `Bearer iamgoingtohackyouraccountnoob!!!`)
            .expect(403);

    });

    test("Delete sends a 403 error if an authorized user tries deleting a different account", async () => {

        await request(app)
            .delete(`/users/iamatotallylegitid`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(403);

    });

    test("Delete removes the test account", async () => {

        const res = await request(app)
            .delete(`/users/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body).toHaveProperty("message");

        const userGone = await User.findOne({ username: testUser.username });
        expect(userGone).toBeNull();

    });

});