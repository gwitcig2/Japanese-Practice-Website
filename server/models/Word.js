import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({

    /**
     * The only actual use-case for entry_id has been for cross-referencing entries in the DB with a local JMDict file.
     * Could be removed to free up more storage and avoid redundancy with MongoDB's automatic IDs.
     */
    entry_id: String,

    /**
     * Necessary for querying the English definitions of Japanese word given their dictionary form, which can either be
     * completely in kanji, completely in kana, or a mix of both (would be held in the kanji field if it was a mix).
     */
    kanji: [String],
    reading: [String],

    /**
     * senses holds useful information for every different definition of a word. Think of one sense as one collection of definitions for a word,
     * with clarifications supplemented as needed. There will almost always be more than one sense for a word.
     *
     * - pos: part-of-speech. Lots of possible different codes for this one. See https://www.edrdg.org/jmdict/jmdict_dtd_h.html for code translations to English.
     * - meanings: English meanings for this sense.
     * - misc: Shows codes identifying miscellaneous information, such as if the word is usually written in kana only for this sense.
     * - info: Provides context as an English sentence for this sense's usage.
     * - appliesToKanji: If these specific meanings for a word only apply when it's written in kanji, the kanji(s) will be held in this array.
     * - appliesToKana: if these specific meanings for a word only apply when it's written in kana, the kana spelling(s) will be held in this array.
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