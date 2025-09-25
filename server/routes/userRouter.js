import express from "express";
import {authenticateJWT} from "../middleware/authenticateJWT.js";
import * as userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", userController.signup);
userRouter.put("/:id", authenticateJWT, userController.handleUpdateUser);
userRouter.delete("/:id", authenticateJWT, userController.handleDeleteUser);

export default userRouter;