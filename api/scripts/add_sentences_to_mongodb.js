import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const paragraph_schema = new mongoose.Schema({
    paragraph: { type: String, required: true, unique: true },
    level: { type: String, required: true },
});

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

const Paragraph = mongoose.model("Paragraph", paragraph_schema);

async function addtoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Paragraph.insertMany(paragraphs);
        console.log("Successfully added!");
        await mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
}
await addtoDB();