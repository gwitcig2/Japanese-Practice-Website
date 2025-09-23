import express from "express";
import {authenticateJWT} from "../middleware/authenticateJWT.js";
import * as userController from "../controllers/userController.js";


const authRouter = express.Router();

authRouter.post("/users", userController.signup);
authRouter.post("/sessions", userController.login);
authRouter.put("/users/:id", authenticateJWT, userController.handleUpdateUser);
authRouter.delete("/users/:id", authenticateJWT, userController.handleDeleteUser);

export default authRouter;