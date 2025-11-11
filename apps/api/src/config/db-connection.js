import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env-config.js";

let memoryServer = null;

export async function connectDB() {

    if (env.NODE_ENV === "test") {

        memoryServer = await MongoMemoryServer.create();

        const uri = memoryServer.getUri();

        console.log("Connecting to mongodb-memory-server...");

        // Prevent multiple memory server connections
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri, {
                dbName: "kanpeki_test",
            });
        }

        console.log("Connected to mongodb-memory-server!");

    } else if (env.NODE_ENV === "development" || env.NODE_ENV === "production") {
        const uri = env.MONGO_URI;

        console.log("Connecting to remote MongoDB...");

        await mongoose.connect(uri);
        console.log("Connected to remote MongoDB!");

    } else {
        throw new Error("The value for env.NODE_ENV is unrecognized.");
    }

}

export async function disconnectDB() {
    await mongoose.disconnect();
    if (memoryServer) await memoryServer.stop();
}
