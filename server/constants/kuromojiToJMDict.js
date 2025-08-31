/**
 *
 * Maps a Kuromoji token's field values `pos`, `pos_detail_*`, and `conjugated_type`
 * to a corresponding JMDict code.
 *
 * Example: Ichidan verbs in Kuromoji have the following field values:
 *  - `token.pos === 動詞`
 *  - `token.conjugated_type === 一段`
 *
 *  Combining this to form a key "動詞:一段" maps to JMDict's code "v1" for typical Ichidan verbs.
 *
 */
export const KUROMOJI_TO_JMDICT = {
    // Nouns

    "名詞:一般": ["n", "pn"],
    "名詞:非自立:副詞可能": ["n"],
    "名詞:固有名詞": ["n-pr"],
    "名詞:固有名詞:地域:国": ["n"],
    "名詞:サ変接続": ["vs", "n"],          // suru nouns
    "名詞:形容動詞語幹": ["adj-na"],  // na-adjectives stems
    "名詞:接尾": ["n-suf", "suf"],
    "名詞:接頭": ["n-pref", "pref"],
    "名詞:数": ["num"],
    "名詞:副詞可能": ["n-adv", "adv", "n"],
    "名詞:代名詞": ["pn"],
    "名詞:接尾:一般": ["n-suf", "suf"],
    "名詞:接尾:助数詞": ["n"], // 時間
    "名詞:非自立:助動詞語幹": ["n-suf", "suf"],

    // Verbs
    "動詞:自立:一段": ["v1"],
    "動詞:非自立:一段": ["v1"],

    // Godan verbs (u-verbs)
    "動詞:非自立": ["v5k-s", "v5u", "v1-s"],
    "動詞:自立:五段・カ行": ["v5k"],
    "動詞:非自立:カ変・クル": ["vk"],
    "動詞:自立:五段・カ行促音便": ["v5k", "v5k-s"],
    "動詞:自立:五段・カ行イ音便": ["v5k", "v5k-s"], // 行く special

    "動詞:自立:五段・ガ行": ["v5g"],
    "動詞:自立:五段・サ行": ["v5s"],
    "動詞:自立:五段・タ行": ["v5t"],
    "動詞:自立:五段・ナ行": ["v5n"],
    "動詞:自立:五段・バ行": ["v5b"],
    "動詞:自立:五段・マ行": ["v5m"],
    "動詞:自立:五段・ラ行": ["v5r", "v5r-i"],
    "動詞:自立:五段・ワ行ウ音便": ["v5u"],

    "動詞:自立:カ変・クル": ["vk"],
    "動詞:自立:カ変・来ル": ["vk"],
    "動詞:自立:サ変・スル": ["vs-i"],  // suru verbs
    "動詞:自立:ザ変・ズル": ["vz"],
    "動詞:自立:五段・ワ行促音便": ["v5u"], // にぎわう
    "動詞:接尾:一段": ["v1"],

    // Adjectives
    "形容詞:自立": ["adj-i"],
    "形容詞:非自立": ["adj-i", "adj-ix"], // sometimes aux-adj but adj-i works
    "形容動詞語幹": ["adj-na"],
    "連体詞": ["adj-pn"],

    // Adverbs
    "副詞:一般": ["adv"],
    "副詞:助詞類接続": ["adv", "adv-to"],

    // Particles & Aux
    "助詞": ["prt"],
    "助詞:係助詞": ["prt"],
    "助詞:格助詞:一般": ["prt"],
    "助詞:格助詞:引用": ["prt"], // と
    "名詞:非自立:一般": ["prt", "n"], // kuromoji is classifying this as an ichidan noun but JMDict says it's a particle. so idk
    "助詞:連体化": ["prt"],
    "助詞:並立助詞": ["prt"], // たり、だり、と
    "助動詞": ["aux-v", "aux-adj", "aux"],

    // Other
    "感動詞": ["int"],
    "接続詞": ["conj"],
    "助詞:接続助詞": ["conj", "prt"],
    "助詞:副助詞": ["conj", "prt", "suf"],
    "助詞:副詞化": ["prt"]
};