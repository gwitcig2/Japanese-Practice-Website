import express from "express";
import {signupUser} from "../services/auth/signupUser.js";
import {loginUser} from "../services/auth/loginUser.js";
import {deleteUser} from "../services/auth/deleteUser.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

    try {
        const { email, password } = req.body;

        const result = await signupUser(email, password);

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: `Account creation error: ${error.message}` });
    }

});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser(email, password);

        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: "Login failed", details: err.message });
    }
});

authRouter.delete("/delete", async (req, res) => {
    try {
        const result = await deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default authRouter;