import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import readingRouter from "./routes/readingRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import flashcardRouter from "./routes/flashcardRouter.js";
import userRouter from "./routes/userRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors({
    origin: process.env.CLIENT_ORIGIN
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/reading", readingRouter);
app.use("/users", userRouter);
app.use("/sessions", sessionsRouter);
app.use("/decks", flashcardRouter);

export default app;

if (process.env.NODE_ENV === "development") {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}
