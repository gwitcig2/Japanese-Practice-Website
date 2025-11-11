import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sanitizeObject from "./middleware/sanitizeObject.js";

import readingRouter from "./routes/readingRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import flashcardRouter from "./routes/flashcardRouter.js";
import userRouter from "./routes/userRouter.js";

import { env } from "./config/env-config.js";

const app = express();

app.use(cors({
    origin: env.CLIENT_ORIGIN
}));

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    req.body = sanitizeObject(req.body);
    next();
});

app.use("/reading", readingRouter);
app.use("/users", userRouter);
app.use("/sessions", sessionsRouter);
app.use("/decks", flashcardRouter);

export default app;