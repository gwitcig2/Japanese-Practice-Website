import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({

    /**
     * `kanji` and `reading` are essentially the keys used for querying the dictionary data of vocabulary words, given their dictionary form.
     *
     *  Most vocab words are written with `kanji` and have their kana spelt out within the `reading` field.
     *
     *      kanji: 食べる
     *      reading: たべる
     *
     *  However, some vocab is spelt only with kana, stored in the `reading` field, while the `kanji` field is null:
     *
     *      kanji: null
     *      reading: する
     *
     */
    kanji: { type: [String], index: true },
    reading: { type: [String], index: true },

    /**
     * `senses` is essentially an array of JSONs that detail all the various ways a word can be used. One `sense` === one meaning.
     *
     * Below are details of the fields that go into a `sense`:
     * - pos: part-of-speech (states if a word is a verb, noun, etc.). These are represented as codes made by the JMDict devs. See https://www.edrdg.org/jmdict/jmdict_dtd_h.html for translations of the codes to English.
     * - meanings: The english meanings for this sense.
     * - misc: Identifies miscellaneous information, such as if the word is usually written in kana only for this sense. Like `pos`, these are also represented as codes made by the JMDict devs.
     * - info: Provides context for this sense's usage as an English sentence.
     * - appliesToKanji: If this sense only applies to the word when it's written with certain kanji(s), the applicable kanji spelling(s) will be held in this array.
     * - appliesToKana: if this sense only applies to the word when it's written with certain kana, the applicable kana spelling(s) will be held in this array.
     *
     */
    senses: [{
        pos: [String],
        meanings: [String],
        misc: [String],
        info: [String],
        appliesToKanji: [String],
        appliesToKana: [String],
    }],
});

const Word = mongoose.model('Word', wordSchema);
export default Word;