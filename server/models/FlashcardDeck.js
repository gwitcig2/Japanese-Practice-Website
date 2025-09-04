import mongoose from "mongoose";

const deckSchema = new mongoose.Schema({

    /**
     * Name of the flashcard deck created by the user.
     */
    name: { type: String, required: true },

    /**
     * Optional description of the flashcard deck if the user wants to add one.
     */
    description: String,

    /**
     * The objectId of the user a flashcard deck is tied to.
     */
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    /**
     * The flashcards in a deck (max 100 per deck)
     */
    flashcards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flashcard" }],

    /**
     * Timestamp for day of creation will be displayed to the user.
     */
    createdAt: { type: Date, default: Date.now },

});

const FlashcardDeck = mongoose.model("FlashcardDeck", deckSchema);
export default FlashcardDeck;