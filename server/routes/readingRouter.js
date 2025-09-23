import express from "express";
import * as readingController from "../controllers/readingController.js";
import {authenticateJWT} from "../middleware/authenticateJWT.js";

const readingRouter = express.Router();

readingRouter.post("/setupReading", authenticateJWT, readingController.getReading);

export default readingRouter;