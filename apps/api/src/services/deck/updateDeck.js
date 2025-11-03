import FlashcardDeck from "../../models/FlashcardDeck.js";

/**
 * Updates the name and/or description of a flashcard deck.
 *
 * @param deckId
 * @param userId
 * @param toUpdate
 * @returns updatedDeck
 */
export async function updateDeck(deckId, userId, toUpdate) {

    const updatedDeck = await FlashcardDeck.findOneAndUpdate(
        { _id: deckId, user: userId },
        { $set: toUpdate },
        { returnDocument: 'after' }
    );

    if (!updatedDeck) {
        const error = new Error("Deck not found.");
        error.status = 404;
        throw error;
    }

    return updatedDeck;

}