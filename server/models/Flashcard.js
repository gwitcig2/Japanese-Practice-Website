import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({

    /**
     * The front of a flashcard, intended to be a Japanese sentence, word, kana, or kanji.
     */
    front: { type: String, required: true },

    /**
     * The back of a flashcard, intended to be an English translation of `front`
     */
    back: { type: String, required: true },

    /**
     * The objectId of the deck this flashcard has a relationship to.
     */
    deck: { type: mongoose.Schema.Types.ObjectId, ref: "FlashcardDeck", required: true },

});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);
export default Flashcard;