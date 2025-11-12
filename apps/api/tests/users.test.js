import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";
import { afterAll, describe, expect, test } from "vitest";

import { validateJWTs } from "./sharedTests.js";

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

});


describe("User authentication routes", () => {

    test("Signup route makes a new test user and provides them with valid access and refresh JWTs", async () => {

        const res = await request(app)
            .post("/users")
            .send(testUser)
            .expect(201);

        // Confirming if testUser's data was added to the database successfully
        dbUser = await User.findOne({ username: testUser.username });

        await validateJWTs(dbUser, res);

        jwtToken = res.body.accessToken;

    });

    test("GET /users/me returns just the user's email and password in a JSON", async () => {

        const res = await request(app)
            .get(`/users/me`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body).toHaveProperty("_id");
        expect(res.body._id === dbUser._id.toString()).toBe(true);

        expect(res.body).toHaveProperty("email");
        expect(res.body.email === testUser.email).toBe(true);

        expect(res.body).toHaveProperty("username");
        expect(res.body.username === testUser.username).toBe(true);

        expect(res.body.password).toBeUndefined();
        expect(res.body.refreshTokens).toBeUndefined();

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