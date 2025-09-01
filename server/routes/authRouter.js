import express from "express";
import {createUser} from "../services/auth/createUser.js";
import {loginUser} from "../services/auth/loginUser.js";
import {deleteUser} from "../services/auth/deleteUser.js";
import {authenticateJWT} from "../services/auth/authenticateJWT.js";

const authRouter = express.Router();

authRouter.post("/users", async (req, res) => {

    try {
        const { email, username, password } = req.body;
        const result = await createUser(email, username, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: `Account creation error: ${error.message}` });
    }

});

authRouter.post("/sessions", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const result = await loginUser(email, username, password);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: "Login failed", details: err.message });
    }
});

authRouter.delete("/users/:id", authenticateJWT, async (req, res) => {
    try {
        if (req.user.userId !== req.params.id) {
            return res.status(403).json({ error: "Unauthorized." });
        }
        const result = await deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default authRouter;