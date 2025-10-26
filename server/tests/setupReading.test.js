
import { grabParagraphFromDB } from "../services/reading/grabParagraph.js";
import { tokenizeParagraph } from "../services/reading/tokenizer.js";
import { normalizeTokens } from "../services/reading/normalizeTokens.js";
import { addEnglishDefinitions } from "../services/reading/toEnglish.js";
import { tokenize } from "kuromojin";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// remove after local testing
await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

afterAll(async () => {
    await mongoose.disconnect();
});

describe("processReading", () => {

    test("The pipeline completes without error", async () => {

        let success = 1;

        try {

            const paragraph = await grabParagraphFromDB();

            const startKuromoji = performance.now();
            const initTokens = await tokenizeParagraph(paragraph);
            const endKuromoji = performance.now();
            const kuromojiDuration = endKuromoji - startKuromoji;

            const normalizedTokens = await normalizeTokens(initTokens, paragraph);

            const withDefinitions = await addEnglishDefinitions(normalizedTokens);

            console.log(`Runtime of setupReading with Kuromoji: ${kuromojiDuration}`);

            const paragraph2 = await grabParagraphFromDB();

            const startKuromojin = performance.now();
            const initTokens2 = await tokenize(paragraph2);
            const endKuromojin = performance.now();

            const normalizedTokens2 = await normalizeTokens(initTokens2, paragraph2);

            const withDefinitions2 = await addEnglishDefinitions(normalizedTokens2);
            const kuromojinDuration = endKuromojin - startKuromojin;

            console.log(`Runtime of setupReading with Kuromojin: ${kuromojinDuration}`);


        } catch (error) {
            console.log(error);
            success = 0;
        } finally {
            expect(success).toBe(1);
        }

    });

})