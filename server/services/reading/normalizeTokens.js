
// import { queryGPT } from "./queryGPT.js";

import { VALID_ICHIDAN_VERBS } from "../../constants/validIchidanVerbs.js";
import { AMBIGUOUS_VERB_FORMS } from "../../constants/ambiguousVerbForms.js";

/**
 *  Post-processes Kuromoji tokens to resolve the following edge-case issues:
 *      - contextual disambiguation of ambiguous verb conjugations
 *      - potential-form verbs not being in dictionary form within their `token.basic_form` field
 *      - TODO: handle archaic dictionary forms (買わす)
 *
 *  @param tokens - Kuromoji tokens
 *  @param paragraph - The paragraph that was tokenized by Kuromoji, in case contextual disambiguation
 *  is necessary.
 *
 *  @returns tokens - Returns the original tokens array with modified `basic_form` fields
 *  wherever necessary.
 *
 */
export async function normalizeTokens(tokens, paragraph) {

    // Track the indexes of tokens to disambiguate so we can override the basic_form later
    const tokensToDisambiguate = [];

    let i = 0;

    for (const token of tokens) {

        if (token.pos === "動詞") {

            const verbStem = token.surface_form + tokens[i + 1].surface_form;

            if (AMBIGUOUS_VERB_FORMS.has(verbStem)) {
                tokensToDisambiguate.push(
                    {
                        "tokenIndex": i,
                        "paragraphIndex": token.word_id,
                        "verbStem": verbStem
                    }
                );
            } else if (
                token.pos_detail_1 === "自立" &&
                token.conjugated_type === "一段"
            ) {
                token.basic_form = potentialToDictionary(token.basic_form);
            }

        }

        i++;

    }

    if (tokensToDisambiguate.length > 0) {
        await disambiguateWithGPT(paragraph, tokens, tokensToDisambiguate);
    }

    return tokens;

}

/**
 * If a verb in `token.basic_form` is left in potential form by Kuromoji,
 * this function converts the verb back to its dictionary form so that it can be properly queried
 * for definitions from JMDict.
 *
 * It is possible for a ru-verb with hiragana characters ending in -eru in its dictionary form
 * (e.g. 食べる) to be false-flagged as a potential-form u-verb. A set of ru-verbs (VALID_ICHIDAN_VERBS)
 * was made to avoid flagging them as verbs to change by this function. But it is not an exhaustive.
 *
 * // TODO: Write a script to query the JMDict in MongoDB to find all Ichidan verbs that have visible -eru hiragana characters at its end.
 *
 * @param base `basic_form` field of the Kuromoji token.
 * @returns {string} The dictionary-form of the verb stuck in potential-form.
 * If a potential-form pattern isn't detected, `base` is returned back.
 *
 */
export function potentialToDictionary(base) {

    // Ignore ru-verbs that have dictionary forms ending in -eru
    if (VALID_ICHIDAN_VERBS.has(base)) {
        return base;
    }

    if (base.endsWith("える")) {
        return base.slice(0, -2) + "う";
    }

    else if (base.endsWith("べる")) {
        return base.slice(0, -2) + "ぶ";
    }

    else if (base.endsWith("げる")) {
        return base.slice(0, -2) + "ぐ";
    }

    else if (base.endsWith("れる")) {
        return base.slice(0, -2) + "る";
    }

    else if (base.endsWith("める")) {
        return base.slice(0, -2) + "む";
    }

    else if (base.endsWith("ねる")) {
        return base.slice(0, -2) + "ぬ";
    }

    else if (base.endsWith("てる")) {
        return base.slice(0, -2) + "つ";
    }

    else if (base.endsWith("せる")) {
        return base.slice(0, -2) + "す";
    }

    else if (base.endsWith("ける")) {
        return base.slice(0, -2) + "く";
    }

    else {
        return base;
    }
}

/**
 * Formats the `prompt` and `role` parameters needed so ChatGPT can be asked to disambiguate
 * ambiguous verb conjugations by analyzing the context of the paragraph they're
 * found in.
 *
 * @param paragraph The original paragraph that was tokenized.
 * @param tokens Kuromoji tokens of `paragraph`.
 * @param tokensToDisambiguate Set of JSON objects with three fields:
 *  - tokenIndex -- where the token is in `tokens`
 *  - paragraphIndex -- where the verb is found in `paragraph` if you were to index by chars.
 *  - verbStem -- The ambiguous verb conjugation.
 *
 * @returns {Promise<void>}
 */
async function disambiguateWithGPT(paragraph, tokens, tokensToDisambiguate) {

    const prompt = `
        I have a Japanese verb form that is ambiguous and requires context from the paragraph to disambiguate.
        
        Verb to disambiguate: ${tokensToDisambiguate}
        Paragraph: ${paragraph}
        
        Question: Which is the correct dictionary form of the verb, given the context of the paragraph? 
        Only return the plain dictionary form as an array without explanation.
        If it's unclear, return the verb as-is.
    `;

    const role = "You are a precise Japanese linguistics assistant."

    const corrections = await queryGPT(prompt, role);

    let i = 0;

    for (const tokenA of tokensToDisambiguate) {

        tokens[tokenA.tokenIndex].basic_form = corrections[i];

    }

}