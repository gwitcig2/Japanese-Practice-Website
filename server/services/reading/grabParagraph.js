
import mongoose from 'mongoose';
// import { queryGPT } from "../misc/queryGPT.js";
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

    console.log("query", query);

    const result = query[0].paragraph;

    console.log(result);

    return result;

}

/*

export async function generateParagraphWithGPT(params) {

    const prompt = `
        Write a paragraph in Japanese with the following parameters in mind:

        Minimum sentences: 4
        Maximum sentences: 8
        JLPT Level: ${params.jlpt}
        Themes to customize the paragraph's story: ${params.themes}
    `;

    const role =
        "You are a Japanese language-learning assistant tasked with writing paragraphs for English-speaking" +
        "learners with ${params.jlpt} JLPT proficiency.";
    ";

    const results = await queryGPT(prompt, role);

    if (typeof results === string) {
        return results;
    }

}

 */