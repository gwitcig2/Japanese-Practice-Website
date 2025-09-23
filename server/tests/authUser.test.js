import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import {expect} from "@jest/globals";

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

    test("Signup route makes a new test user", async () => {

        const res = await request(app)
            .post("/auth/users")
            .send(testUser)
            .expect(201);

        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("username");

        dbUser = await User.findOne({ username: testUser.username });
        expect(dbUser).toBeDefined();

    });

    test("Login route finds the newly created test account and returns a JWT", async () => {

        const res = await request(app)
            .post("/auth/sessions")
            .send(testUser)
            .expect(200);

        expect(res.body).toHaveProperty("token");

        jwtToken = res.body.token;

    });

    test("Update route changes a user's email, username, and password, and the returned doc does not contain the password", async () => {

        const res = await request(app)
            .put(`/auth/users/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(accountChanges)
            .expect(200);

        expect(res.body.email).toBe(accountChanges.email);

        expect(res.body.username).toBe(accountChanges.username);

        expect(res.body.password).toBeUndefined();

    });

    test("Update route returns code 401 when no authorization is provided", async () => {

        await request(app)
            .put(`/auth/users/${dbUser._id}`)
            .send(accountChanges)
            .expect(401);

    });

    test("Update route returns code 403 if a user tries updating a different account", async () => {

        await request(app)
            .put(`/auth/users/imBouttaHackThisDudesAccountLOL`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(accountChanges)
            .expect(403);

    });

    test("Update route returns code 409 if a username or email already exists", async () => {

        const emailOnly = {
            email: "heresMyNewEmail@example.com"
        }

        await request(app)
            .put(`/auth/users/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(emailOnly)
            .expect(409);

        const usernameOnly = {
            username: "theGreatestTechnicianThatsEverLived"
        }

        await request(app)
            .put(`/auth/users/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(usernameOnly)
            .expect(409);

    });

    test("Delete sends a 401 if no authorization is provided", async () => {

        await request(app)
           .delete(`/auth/users/${dbUser._id}`)
           .expect(401);
    });

    test("Delete sends a 403 error when JWT authorization is invalid ", async () => {

        await request(app)
            .delete(`/auth/users/${dbUser._id}`)
            .set("Authorization", `Bearer iamgoingtohackyouraccountnoob!!!`)
            .expect(403);

    });

    test("Delete sends a 403 error if an authorized user tries deleting a different account", async () => {

        await request(app)
            .delete(`/auth/users/iamatotallylegitid`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(403);

    });

    test("Delete removes the test account", async () => {

        const res = await request(app)
            .delete(`/auth/users/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body).toHaveProperty("message");

        const userGone = await User.findOne({ username: testUser.username });
        expect(userGone).toBeNull();

    });

});