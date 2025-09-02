import kuromoji from "kuromoji";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yes, Kuromoji needs to be told where its dictionary is. (Kuromojin though...?)
const dictPath = path.resolve(__dirname, "../../node_modules/kuromoji/dict");

/**
 * Builds the Kuromoji tokenizer.
 *
 * Returns the tokenizer object if successful, otherwise throws the builder's error.
 */
async function initTokenizer() {
    return new Promise((resolve, reject) => {
        kuromoji.builder({dicPath: dictPath}).build((err, builtTokenizer) => {
            if (err) {
                reject(err);
            }
            resolve(builtTokenizer);
        });
    })
}

/**
 * Tokenizes each word in a Japanese paragraph with dictionary data.
 *
 * @param {string} paragraph - The Japanese paragraph to tokenize.
 *
 * @returns {Promise<Array>} - An array of JSON objects that contain dictionary data for each word, like surface form, reading, so on.
 *
 */
export async function tokenizeParagraph(paragraph) {
    try {
        const tokenizer = await initTokenizer();
        return tokenizer.tokenize(paragraph);
    } catch (err) {
        console.error("Tokenizer error: ", err);
        throw err;
    }
}