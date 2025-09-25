import express from "express";
import * as authController from "../controllers/sessionsController.js";

const sessionsRouter = express.Router();

sessionsRouter.post("/", authController.login);
sessionsRouter.put("/", authController.handleRefresh);
sessionsRouter.delete("/", authController.handleLogout);

export default sessionsRouter;