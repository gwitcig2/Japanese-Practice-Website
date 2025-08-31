import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

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

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
    processJsonFile();
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

function processJsonFile() {
    const rawData = fs.readFileSync('./server/scripts/jmdict-eng-3.6.1.json');

    const jmdict = JSON.parse(rawData);

    console.log("JMDict successfully parsed. Processing...");

    const processedEntries = jmdict.words.map(entry => ({
        entry_id: entry.id,
        kanji: entry.kanji.map(k => k.text || k),
        reading: entry.kana.map(k => k.text),
        senses: entry.sense.map(s => ({
            pos: s.partOfSpeech || [],
            meanings: s.gloss.map(g => g.text),
            misc: s.misc || [],
            info: s.info || [],
            appliesToKanji: s.appliesToKanji || [],
            appliesToKana: s.appliesToKana || [],
        })),
    }));

    console.log("Processed. Pushing to MongoDB...");

    Word.insertMany(processedEntries)
        .then(() => {
            console.log('Data successfully inserted into MongoDB');
            mongoose.connection.close();
        })
        .catch(err => {
            console.error('Error inserting data:', err);
            mongoose.connection.close();
        });
}