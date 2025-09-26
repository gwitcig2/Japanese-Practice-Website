import express from "express";
import * as sessionsController from "../controllers/sessionsController.js";

const sessionsRouter = express.Router();

sessionsRouter.post("/", sessionsController.login);
sessionsRouter.put("/", sessionsController.handleRefresh);
sessionsRouter.delete("/", sessionsController.handleLogout);

export default sessionsRouter;