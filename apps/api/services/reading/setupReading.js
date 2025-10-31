
import { grabParagraphFromDB } from "./grabParagraph.js";
import { tokenize } from "kuromojin";
import { normalizeTokens } from "./normalizeTokens.js";
import { addEnglishDefinitions } from "./toEnglish.js";

/**
 * Main pipeline for creating a Japanese paragraph reading with dictionary
 * data in English for each word.
 *
 * @returns {Promise<{paragraph: string, tokens: *}>}
 */
export async function setupReading(input) {

    const paragraph = await grabParagraphFromDB();
    const initTokens = await tokenize(paragraph);
    const normalizedTokens = await normalizeTokens(initTokens, paragraph);
    const withDefinitions = await addEnglishDefinitions(normalizedTokens);

    return {
      paragraph: paragraph,
      tokens: withDefinitions
    };

}
