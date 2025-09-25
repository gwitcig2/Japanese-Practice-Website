import express from "express";
import * as authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/", authController.login);
authRouter.put("/", authController.handleRefresh);
authRouter.delete("/", authController.handleLogout);

export default authRouter;