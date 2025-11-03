import FlashcardDeck from "../../models/FlashcardDeck.js";
import Flashcard from "../../models/Flashcard.js";

/**
 * Updates the content in the front and/or back of a flashcard in a deck.
 *
 * @param deckId
 * @param flashcardId
 * @param userId
 * @param toUpdate
 * @returns flashcard
 */
export async function updateFlashcard(deckId, flashcardId, userId, toUpdate) {

    const deck = await FlashcardDeck.findOne({ _id: deckId, user: userId });

    if (!deck) {
        const error = new Error("Deck not found.");
        error.status = 404;
        throw error;
    }

    const flashcard = await Flashcard.findOneAndUpdate(
        { _id: flashcardId, deck: deckId },
        { $set: toUpdate },
        { returnDocument: 'after' }
    );

    if (!flashcard) {
        const error = new Error("Flashcard not found.");
        error.status = 404;
        throw error;
    }

    return flashcard;

}