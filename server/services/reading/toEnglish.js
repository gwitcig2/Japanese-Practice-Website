import mongoose from 'mongoose';
import Word from "../../models/Word.js"
import { KUROMOJI_TO_JMDICT } from "../../constants/kuromojiToJMDict.js";

/**
 *
 * Converts a Kuromoji token's `token.pos`, `token_pos_detail_*`, and `conjugated_type` fields to a
 * corresponding JMDict code for accurate retrieval of dictionary data.
 *
 * @param token
 * @returns {*|string[]}
 */
function mapKuromojiToJMDict(token) {

    if (token.pos === "*" || token.pos === "記号") {
        return ["unc"];
    }

    const strictKey = [token.pos, token.pos_detail_1, token.pos_detail_2, token.pos_detail_3, token.conjugated_type]
        .filter(elem => elem !== '*')
        .join(":");

    if (KUROMOJI_TO_JMDICT[strictKey]) {
        return KUROMOJI_TO_JMDICT[strictKey];
    }

    // Sometimes kuromoji's token.conjugated_type is "too specific" so we make a pos-only key.
    const posKey = [token.pos, token.pos_detail_1, token.pos_detail_2, token.pos_detail_3]
        .filter(elem => elem !== '*')
        .join(":");

    if (KUROMOJI_TO_JMDICT[posKey]) {
        return KUROMOJI_TO_JMDICT[posKey];
    }

    // And sometimes token.pos with token.pos_detail_1 is all you need
    const lastKey = [token.pos, token.pos_detail_1]
    .filter(elem => elem !== '*')
    .join(":");

    if (KUROMOJI_TO_JMDICT[lastKey]) {
        return KUROMOJI_TO_JMDICT[lastKey];
    }

    // And in rare cases, sometimes you're just way too strict, and need only the part-of-speech to line up.
    if (KUROMOJI_TO_JMDICT[token.pos]) {
        return KUROMOJI_TO_JMDICT[token.pos];
    }

    return ["unc"];
}

/**
 * Filters the `senses` within a dictionary document so that only definitions matching
 * the JMDict code mapped from the `mapKuromojiToJMDict` function are available.
 *
 * @param senses
 * @param queryForm
 * @returns {*}
 */
function filterSenses(senses, queryForm) {
    return senses.filter(sense => {
        const appliesKanji = sense.appliesToKanji || [];
        const appliesKana = sense.appliesToKana || [];

        // "*" means universal
        const kanjiOk =
            appliesKanji.length === 0 ||
            appliesKanji.includes("*") ||
            appliesKanji.includes(queryForm);

        const kanaOk =
            appliesKana.length === 0 ||
            appliesKana.includes("*") ||
            appliesKana.includes(queryForm);

        return kanjiOk || kanaOk;
    });
}

/**
 * Appends applicable dictionary data to each token in an array of Kuromoji tokens.
 *
 * @param tokens
 * @returns {Promise<*>}
 */
export async function addEnglishDefinitions(tokens) {
    try {
        const basicForms = tokens.map(t => t.basic_form);

        // Grab dictionary entries that match any kanji/reading in batch
        const dictionaryDocs = await Word.find({
            $or: [
                { kanji: { $in: basicForms } },
                { reading: { $in: basicForms } },
            ],
        }).lean();

        // Map kanji/reading → candidate docs (maybe make this its own function)
        const docMap = new Map();
        for (const doc of dictionaryDocs) {
            (doc.kanji || []).forEach(k => {
                if (!docMap.has(k)) docMap.set(k, []);
                docMap.get(k).push(doc);
            });
            (doc.reading || []).forEach(r => {
                if (!docMap.has(r)) docMap.set(r, []);
                docMap.get(r).push(doc);
            });
        }

        // For each token, attach filtered definitions
        return tokens.map(token => {
            const candidates = docMap.get(token.basic_form) || [];
            const mappedPOS = mapKuromojiToJMDict(token);

            const senses = candidates.flatMap(doc =>
                doc.senses.filter(sense =>
                    // POS filter (if we have one)
                    (!mappedPOS || sense.pos.some(pos => mappedPOS.includes(pos))) &&
                    // Kanji/kana applicability filter
                    filterSenses([sense], token.basic_form).length > 0
                )
            );

            return {
                ...token,
                senses,
            };
        });
    } catch (error) {
        console.error("Error in addEnglishDefinitions:", error);
        return tokens; // fall back to returning tokens untouched
    }
}