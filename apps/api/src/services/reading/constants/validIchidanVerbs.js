/**
 * A set of ichidan verbs that have visible hiragana characters ending in -eru
 * in their dictionary forms.
 *
 * Necessary to avoid falsely flagging them as potential-form u-verbs that need
 * to be converted back to dictionary form in a Kuromoji token's `basic_form` field.
 *
 * @type {Set<string>}
 */
export const VALID_ICHIDAN_VERBS = new Set([
    "食べる",
    "見せる",
    "教える",
    "答える",
    "考える",
    "調べる",
    "集める",
    "変える",
    "始める",
    "決める",
    "覚える",
    "忘れる",
    "捨てる",
    "入れる",
    "見える",
    "聞こえる",
    "与える",
    "疲れる"
]);