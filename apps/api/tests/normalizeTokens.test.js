
import { tokenize } from "kuromojin";
import { potentialToDictionary } from "../src/services/reading/normalizeTokens.js";
import { describe, expect, test } from "vitest";

describe("potentialToDictionary", () => {
    test("Converts potential-form u-verbs back to dictionary-form", async () => {

        const tokens = await tokenize(
            "買える、行ける、踊れる、話せる、待てる、死ねる、読める、作れる、泳げる、遊べる。"
        );

        const verbs = tokens
            .filter(t => t.pos === "動詞")
            .flatMap(t => t.basic_form);

        const output = [];

        for (let verb of verbs) {

            verb = potentialToDictionary(verb);

            output.push(verb);

        }

        const expected = [
            "買う",
            "行く",
            "踊る",
            "話す",
            "待つ",
            "死ぬ",
            "読む",
            "作る",
            "泳ぐ",
            "遊ぶ"
        ];

        expect(output).toEqual(expected);

    });

    test("Mutates the token.basic_form field in a simple sentence", async () => {

        const tokens = await tokenize("私は東京に行けます。");

        const expected = [
            { basic_form: "私"},
            { basic_form: "は"},
            { basic_form: "東京"},
            { basic_form: "に"},
            { basic_form: "行く"},
            { basic_form: "ます"},
            { basic_form: "。"}
        ];

        let i = 0;

        for (const token of tokens) {

            if (token.pos === "動詞") {


                if (
                    token.pos_detail_1 === "自立" &&
                    token.conjugated_type === "一段"
                ) {
                    tokens[i] = { ...tokens[i], basic_form: potentialToDictionary(tokens[i].basic_form)};
                }

            }

            expect(tokens[i]).toMatchObject(expected[i]);

            i++;

        }

    });
});