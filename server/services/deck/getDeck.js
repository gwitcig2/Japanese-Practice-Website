import FlashcardDeck from "../../models/FlashcardDeck.js";

/**
 * Retrieves one user's flashcard deck from the MongoDB and populates the 'flaschards' field with
 * an array of flashcards that are tied to the deck's objectId.
 *
 * @param deckId
 * @param userId
 * @returns deck
 */
export async function getDeck(deckId, userId) {

    const deck = await FlashcardDeck.findOne({ _id: deckId, user: userId })
        .populate("flashcards"); // populate may be unnecessary here or in getDecks, I'm not sure which one is the impostor

    if (!deck) {
        const error = new Error("Deck not found.");
        error.status = 404;
        throw error;
    }

    return deck;

}