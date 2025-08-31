import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
// import bcrypt from "bcrypt";
import User from "../models/User.js";
// import User from "../models/User.js";

const testUser = {
    email: "iAmTest@example.com",
    password: "ThisIsMyPassword",
};

let jwtToken;

afterAll(async () => {
   await mongoose.disconnect();
});

describe("User authentication routes", () => {

    test("Signup route makes a new test user", async () => {

        const res = await request(app)
            .post("/auth/signup")
            .send(testUser)
            .expect(201);

        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("email");

        const user = await User.findOne({ email: testUser.email });
        expect(user).toBeDefined();
        console.log(user);

    });

    test("Login route finds the newly created test account and returns a JWT", async () => {

        const res = await request(app)
            .post("/auth/login")
            .send(testUser)
            .expect(200);

        expect(res.body).toHaveProperty("token");
        jwtToken = res.body.token;

        console.log(jwtToken);

    });

    test("Delete removes the test account", async () => {

        const res = await request(app)
            .delete("/auth/delete")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body).toBe({ message: "Account deleted!" });

        const user = await User.findOne({ email: testUser.email });
        expect(user).toBeNull();

    });

});