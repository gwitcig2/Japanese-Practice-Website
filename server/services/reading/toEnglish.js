import mongoose from 'mongoose';
import { tokenizeParagraph } from "./tokenizer.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Word from "../../models/Word.js"
import { KUROMOJI_TO_JMDICT } from "../../constants/kuromojiToJMDict.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// remove after local testing
/*
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB Connection Error:", err));


 */
/**
 *
 * Converts a Kuromoji token's `token.pos`, `token_pos_detail_*`, and `conjugated_type` fields to a
 * corresponding JMDict code for accurate retrieval of dictionary data.
 *
 * @param token
 * @returns {*|string[]}
 */
function mapKuromojiToJMDict(token) {

    if (token.pos === "*" || token.pos === "記号") {
        return ["unc"];
    }

    const strictKey = [token.pos, token.pos_detail_1, token.pos_detail_2, token.pos_detail_3, token.conjugated_type]
        .filter(elem => elem !== '*')
        .join(":");

    if (KUROMOJI_TO_JMDICT[strictKey]) {
        return KUROMOJI_TO_JMDICT[strictKey];
    }

    // Sometimes kuromoji's token.conjugated_type is "too specific" so we make a pos-only key.
    const posKey = [token.pos, token.pos_detail_1, token.pos_detail_2, token.pos_detail_3]
        .filter(elem => elem !== '*')
        .join(":");

    if (KUROMOJI_TO_JMDICT[posKey]) {
        return KUROMOJI_TO_JMDICT[posKey];
    }

    // And sometimes token.pos with token.pos_detail_1 is all you need
    const lastKey = [token.pos, token.pos_detail_1]
    .filter(elem => elem !== '*')
    .join(":");

    if (KUROMOJI_TO_JMDICT[lastKey]) {
        return KUROMOJI_TO_JMDICT[lastKey];
    }

    if (KUROMOJI_TO_JMDICT[token.pos]) {
        return KUROMOJI_TO_JMDICT[token.pos];
    }

    return ["unc"]; // unclassified
}

/**
 * Filters the `senses` within a dictionary document so that only definitions matching
 * the JMDict code mapped from the `mapKuromojiToJMDict` function are available.
 *
 * @param senses
 * @param queryForm
 * @returns {*}
 */
function filterSenses(senses, queryForm) {
    return senses.filter(sense => {
        const appliesKanji = sense.appliesToKanji || [];
        const appliesKana = sense.appliesToKana || [];

        // "*" means universal
        const kanjiOk =
            appliesKanji.length === 0 ||
            appliesKanji.includes("*") ||
            appliesKanji.includes(queryForm);

        const kanaOk =
            appliesKana.length === 0 ||
            appliesKana.includes("*") ||
            appliesKana.includes(queryForm);

        return kanjiOk || kanaOk;
    });
}

/**
 * Appends applicable dictionary data to each token in an array of Kuromoji tokens.
 *
 * @param tokens
 * @returns {Promise<*>}
 */
export async function addEnglishDefinitions(tokens) {
    try {
        const basicForms = tokens.map(t => t.basic_form);

        // Grab dictionary entries that match any kanji/reading in batch
        const dictionaryDocs = await Word.find({
            $or: [
                { kanji: { $in: basicForms } },
                { reading: { $in: basicForms } },
            ],
        }).lean();

        // Map kanji/reading → candidate docs (maybe make this its own function)
        const docMap = new Map();
        for (const doc of dictionaryDocs) {
            (doc.kanji || []).forEach(k => {
                if (!docMap.has(k)) docMap.set(k, []);
                docMap.get(k).push(doc);
            });
            (doc.reading || []).forEach(r => {
                if (!docMap.has(r)) docMap.set(r, []);
                docMap.get(r).push(doc);
            });
        }

        // For each token, attach filtered definitions
        return tokens.map(token => {
            const candidates = docMap.get(token.basic_form) || [];
            const mappedPOS = mapKuromojiToJMDict(token);

            const senses = candidates.flatMap(doc =>
                doc.senses.filter(sense =>
                    // POS filter (if we have one)
                    (!mappedPOS || sense.pos.some(pos => mappedPOS.includes(pos))) &&
                    // Kanji/kana applicability filter
                    filterSenses([sense], token.basic_form).length > 0
                )
            );

            return {
                ...token,
                senses,
            };
        });
    } catch (error) {
        console.error("Error in addEnglishDefinitions:", error);
        return tokens; // fall back to returning tokens untouched
    }
}


/*
const paragraphs = [
    { paragraph: "毎朝、駅まで歩いて行くのは大変ですが、健康のためになると思います。電車の中では本を読んだり、音楽を聞いたりして時間を過ごします。", level: "N3"},
    { paragraph: "子供のころ、よく近所の公園で友達と遊びました。今でもその公園を通ると、当時の楽しい思い出を思い出します。", level: "N3"},
    { paragraph: "私は料理が好きで、週末になると新しいレシピに挑戦します。先日はカレーを作ったのですが、家族にとても喜ばれました。", level: "N3"},
    { paragraph: "この町には古い神社があります。毎年夏祭りが行われ、たくさんの人でにぎわいます。", level: "N3"},
    { paragraph: "旅行の計画を立てるときは、まず目的地の天気を調べます。雨が降ると困るので、できれば晴れの日に行きたいです。", level: "N3"},
    { paragraph: "大学に入ってから、一人暮らしを始めました。最初は不安でしたが、だんだん慣れてきて楽しくなってきました。", level: "N3"},
    { paragraph: "仕事で疲れたときは、好きな映画を見て気分をリフレッシュします。特にコメディ映画を見ると、自然に笑顔になります。", level: "N3"},
    { paragraph: "日本では四季があり、それぞれの季節に楽しみがあります。春は花見、夏は海、秋は紅葉、冬は温泉が人気です。", level: "N3"},
    { paragraph: "先週の土曜日、友達と動物園に行きました。かわいいパンダや元気なサルを見て、とても楽しかったです。", level: "N3"},
    { paragraph: "新しい言語を勉強するのは大変ですが、できることが増えると嬉しくなります。毎日少しずつ続けることが大事だと思います。", level: "N3"},
    { paragraph: "兄はスポーツが得意で、よくサッカーの試合に出ています。私はあまり運動が得意ではありませんが、応援するのが楽しいです。", level: "N3"},
    { paragraph: "先日、初めて海外から来た観光客に道を聞かれました。英語はあまり得意ではありませんが、なんとか伝えることができました。", level: "N3"},
    { paragraph: "駅前に新しいカフェができました。おしゃれな雰囲気で、コーヒーもおいしいので、最近よく行っています。", level: "N3"},
    { paragraph: "小学生のときに読んだ本を、今でも大切に持っています。その本を読むと、子供のころの気持ちに戻れる気がします。", level: "N3"},
    { paragraph: "健康のために毎日走るようにしています。最初は三十分も走れませんでしたが、今では一時間走れるようになりました。", level: "N3"},
    { paragraph: "母は花が好きで、庭にいろいろな花を育てています。春になると、庭がとても明るくなります。", level: "N3"},
    { paragraph: "昨日の夜は雨が強くて、なかなか眠れませんでした。朝起きたら、空がすっきり晴れていて気持ちがよかったです。", level: "N3"},
    { paragraph: "友達と一緒に旅行すると、思い出がもっと楽しいものになります。一人旅もいいですが、私は誰かと行くほうが好きです。", level: "N3"},
    { paragraph: "駅で財布を落としてしまいました。とても困っていたのですが、親切な人が届けてくれて助かりました。", level: "N3"},
    { paragraph: "昔からピアノを習っています。今はあまり上手ではありませんが、音楽を聞くのも弾くのも大好きです。", level: "N3"},
    { paragraph: "最近は忙しくて本を読む時間がありません。けれども、少しでも時間を作って読むように心がけています。", level: "N3"},
    { paragraph: "学校の授業で歴史を勉強するのは少し難しいです。しかし、昔の人々の生活を知るのは面白いと思います。", level: "N3"},
    { paragraph: "朝ご飯を食べないと、一日中元気が出ません。だから、できるだけ毎日しっかり食べるようにしています。", level: "N3"},
    { paragraph: "友達の誕生日にプレゼントを買いました。何を選ぶか迷いましたが、結局かわいいマグカップにしました。", level: "N3"},
    { paragraph: "山登りは大変ですが、山頂からの景色を見ると疲れが消えます。自然の中で過ごすと気持ちもリフレッシュします。", level: "N3"},
    { paragraph: "アルバイトを始めてから、お金の大切さを学びました。自分で働いたお金を使うと、無駄にしないようになります。", level: "N3"},
    { paragraph: "毎日日本語を勉強していると、少しずつわかるようになってきます。わからないことがあるときは、先生に質問します。", level: "N3"},
    { paragraph: "新しい携帯電話を買いました。前のより軽くて使いやすいので、とても気に入っています。", level: "N3"},
    { paragraph: "駅の近くにあるラーメン屋は、いつも行列ができています。スープが濃厚で、とてもおいしいと評判です。", level: "N3"},
    { paragraph: "夏休みに家族と海に行きました。波で遊んだり、貝を拾ったりして、一日中楽しく過ごしました。", level: "N3"}
];

let testNum = 1;


    console.log(`Test ${testNum}`);
    testNum++;

    const testTokens = await tokenizeParagraph(
        "できる、される、させる、させられる。"
    );

    const theTest = await addEnglishDefinitions(testTokens);

    console.log(theTest);


 */


// await mongoose.disconnect();