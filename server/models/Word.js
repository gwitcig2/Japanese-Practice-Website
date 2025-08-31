import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    entry_id: String,
    kanji: [String],
    reading: [String],
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