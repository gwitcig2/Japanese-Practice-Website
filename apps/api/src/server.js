import express from "express";
import cors from "cors";
import mongoose from "mongoose";
/*
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

 */
import cookieParser from "cookie-parser";
import sanitizeObject from "./middleware/sanitizeObject.js";

import readingRouter from "./routes/readingRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import flashcardRouter from "./routes/flashcardRouter.js";
import userRouter from "./routes/userRouter.js";

import { env } from "./config/env-config.js";

const app = express();
const port = env.NODE_SERVER_PORT;

app.use(cors({
    origin: env.CLIENT_ORIGIN
}));

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
   req.body = sanitizeObject(req.body);
   next();
});

mongoose.connect(env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/reading", readingRouter);
app.use("/users", userRouter);
app.use("/sessions", sessionsRouter);
app.use("/decks", flashcardRouter);

export default app;

if (env.NODE_ENV === "development") {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}
