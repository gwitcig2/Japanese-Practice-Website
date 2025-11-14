import OpenAI from "openai";
// import { env } from "../../config/env-config.js";

const client = new OpenAI({
    apiKey: /* env.OPENAI_API_KEY */ "placeholder",
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