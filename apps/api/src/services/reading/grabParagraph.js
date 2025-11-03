
import mongoose from 'mongoose';
// import { queryGPT } from "../ai/queryGPT.js";
import Paragraph from "../../models/Paragraph.js";

/**
 * Retrieves a random paragraph from the "Paragraphs" collection in the MongoDB.
 * Currently hard-coded to retrieve N3-level paragraphs only, but will be refactored
 * so that the user selects their estimated JLPT level.
 *
 * @returns {Promise<*>}
 */
export async function grabParagraphFromDB(/* params */) {

    const query = await Paragraph.aggregate([
        { $match: { level: "N3"} },
        { $sample: { size: 1 } }
    ]);

    const result = query[0].paragraph;

    return result;

}

/*

export async function generateParagraphWithGPT(params) {

    const prompt = `
        Write a paragraph in Japanese and its English translations with the following constraints:

        Number of sentences: ${params.sentences}
        JLPT Level: ${params.jlpt}
        Theme : ${params.theme}

        Return your answer as a JSON object with this structure:
        {
            "baseParagraph": "The full paragraph in Japanese."
            "englishTranslations": ["English translation of sentence 1", ..., "English translation of sentence ${params.sentences}"]
        }

        Do not include any text outside of the JSON. Do not add explanations or commentary. Ensure the JSON is valid and parsable.
        Also ensure englishTranslations.length === params.sentences
    `;

    const role = `
        You are a Japanese language-learning assistant that writes Japanese paragraphs for learners.
        The paragraph must match JLPT ${params.jlpt} proficiency level. Provide accurate English translations per sentence.
    `;

    const results = await queryGPT(prompt, role);

    try {
        return JSON.parse(result);
    } catch (err) {
        console.error("Failed to parse GPT response as JSON:", err);
        throw new Error("Invalid JSON from GPT");
    }

}

 */