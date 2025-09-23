import express from "express";
import {setupReading} from "../services/reading/setupReading.js";

const readingRouter = express.Router();

readingRouter.post("/setupReading", async (req, res) => {

    try {
        const { input } = req.body;
        const result = await setupReading(input);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: `Server Error: ${error.message}` });
    }

});

export default readingRouter;