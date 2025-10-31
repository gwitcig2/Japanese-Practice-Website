import {setupReading} from "../services/reading/setupReading.js";

/**
 * Handles the request to create a new Japanese reading with english JMDict data for each word.
 *
 * POST /setupReading
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function getReading(req, res) {

    try {
        const { input } = req.body;
        const result = await setupReading(input);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: `Server Error: ${error.message}` });
    }

}