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
            .post("/auth/signup")
            .send(testUser)
            .expect(201);

        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("email");

        dbUser = await User.findOne({ email: testUser.email });
        expect(dbUser).toBeDefined();

    });

    test("Login route finds the newly created test account and returns a JWT", async () => {

        const res = await request(app)
            .post("/auth/login")
            .send(testUser)
            .expect(200);

        expect(res.body).toHaveProperty("token");

        jwtToken = res.body.token;

    });

    test("Delete sends a 401 if no authorization is provided", async () => {

        await request(app)
           .delete(`/auth/account/${dbUser._id}`)
           .expect(401);
    });

    test("Delete sends a 403 error when JWT authorization is invalid ", async () => {

        await request(app)
            .delete(`/auth/account/${dbUser._id}`)
            .set("Authorization", `Bearer iamgoingtohackyouraccountnoob!!!`)
            .expect(403);

    });

    test("Delete sends a 403 error if an authorized user tries deleting a different account", async () => {

        await request(app)
            .delete(`/auth/account/iamatotallylegitid`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(403);

    });

    test("Delete removes the test account", async () => {

        const res = await request(app)
            .delete(`/auth/account/${dbUser._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body).toHaveProperty("message");

        const userGone = await User.findOne({ email: testUser.email });
        expect(userGone).toBeNull();

    });

});