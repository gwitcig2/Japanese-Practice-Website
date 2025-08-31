/**
 * A set of verb conjugations that can only be disambiguated by analyzing
 * the context of a sentence, making them necessary to flag when post-processing
 * Kuromoji tokens.
 *
 * @type {Set<string>}
 */
export const AMBIGUOUS_VERB_FORMS = new Set([
    "出させ", // can be ださせ (出す) or でさせ (出る)
    "来させ", // can be こさせ (くる) or きたさせ (来す)
    "こら" // if 来る is written as こられる, Kuromoji makes こら its own token, creating ambiguity with the interjection こら and also the noun 子等. *Really* rare.
]);