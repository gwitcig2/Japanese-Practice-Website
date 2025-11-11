import { beforeAll, afterAll, afterEach } from "vitest";
import { connectDB, disconnectDB } from "../src/config/db-connection.js";
import mongoose from "mongoose";

beforeAll(async () => {
    await connectDB();
}, 20000);

/*
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

 */

afterAll(async () => {
    await disconnectDB();
});
