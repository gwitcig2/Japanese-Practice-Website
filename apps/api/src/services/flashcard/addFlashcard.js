import FlashcardDeck from "../../models/FlashcardDeck.js";
import Flashcard from "../../models/Flashcard.js";

/**
 * Adds a Flashcard to a user's flashcard deck.
 *
 * @param front
 * @param back
 * @param userId
 * @param deckId
 * @returns flashcard
 */
export async function addFlashcard(front, back, userId, deckId) {

    const deck = await FlashcardDeck.findOne({ _id: deckId, user: userId });

    if (!deck) {
        const error = new Error("Deck not found.");
        error.status = 404;
        throw error;
    }

    if (deck.flashcards.length >= 100) {
        const error = new Error("FLashcard limit on this deck exceeded.");
        error.status = 400;
        throw error;
    }

    const flashcard = await Flashcard.create({ front, back, deck: deckId });
    deck.flashcards.push(flashcard._id);
    await deck.save();

    return flashcard;

}