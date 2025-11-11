
import { grabParagraphFromDB } from "../src/services/reading/grabParagraph.js";
import { normalizeTokens } from "../src/services/reading/normalizeTokens.js";
import { addEnglishDefinitions } from "../src/services/reading/toEnglish.js";
import { tokenize } from "kuromojin";

import { describe, expect, test } from "vitest";

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