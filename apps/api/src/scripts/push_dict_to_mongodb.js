import fs from 'fs';
import mongoose from 'mongoose';
import Word from "../models/Word.js";

import { env } from "../config/env-config.js";

mongoose.connect(env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
    processJsonFile();
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

function processJsonFile() {
    const rawData = fs.readFileSync('./api/scripts/jmdict-eng-3.6.1.json');

    const jmdict = JSON.parse(rawData);

    console.log("JMDict successfully parsed. Processing...");

    const processedEntries = jmdict.words.map(entry => ({
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