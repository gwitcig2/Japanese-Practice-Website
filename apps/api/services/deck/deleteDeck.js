import FlashcardDeck from "../../models/FlashcardDeck.js";

/**
 * Deletes one user's flashcard deck, and corresponding flashcards undergo cascade deletion.
 *
 * @param deckId
 * @param userId
 * @returns {Promise<void>}
 */
export async function deleteDeck(deckId, userId) {

    const deletedDeck = await FlashcardDeck.findOneAndDelete({
        _id: deckId,
        user: userId,
    });

    if (!deletedDeck) {
        const error = new Error("Deck not found.");
        error.status = 404;
        throw error;
    }

}