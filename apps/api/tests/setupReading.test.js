
import { grabParagraphFromDB } from "../src/services/reading/grabParagraph.js";
import { normalizeTokens } from "../src/services/reading/normalizeTokens.js";
import { addEnglishDefinitions } from "../src/services/reading/toEnglish.js";
import { tokenize } from "kuromojin";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { afterAll, describe, expect, test } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

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

            const initTokens = await tokenize(paragraph);

            const normalizedTokens = await normalizeTokens(initTokens, paragraph);

            const withDefinitions = await addEnglishDefinitions(normalizedTokens);

            for (const def of withDefinitions) {
                expect(def).toHaveProperty("senses");
            }

        } catch (error) {
            console.log(error);
            success = 0;
        } finally {
            expect(success).toBe(1);
        }

    });

})