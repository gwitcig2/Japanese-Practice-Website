import OpenAI from "openai";
import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";

// Remove once globalized
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Makes an API call to OpenAI's "gpt-4o-mini" model.
 *
 * @param prompt - A string articulating the issue for ChatGPT to resolve.
 * @param role - A string that tells ChatGPT its specialty as a problem-solver.
 * @returns {Promise<*>} - Results vary depending on what you ask for in your `prompt`.
 */
export async function queryGPT(prompt, role) {

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: role },
            { role: "user", content: prompt }
        ],
        temperature: 0, // we want determinism
    });

    return response.choices[0].message.content.trim();

}