import mongoose from "mongoose";
import Flashcard from "./Flashcard.js";

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

/**
 * Middleware for automatically removing all flashcards tied to a deck.
 */
deckSchema.pre("findOneAndDelete", async function (next) {

    try {
        const deckId = this.getQuery()._id;
        await Flashcard.deleteMany({ deck: deckId });
        next();
    } catch (err) {
        next(err);
    }

});

const FlashcardDeck = mongoose.model("FlashcardDeck", deckSchema);
export default FlashcardDeck;