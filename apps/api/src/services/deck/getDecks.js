import FlashcardDeck from "../../models/FlashcardDeck.js";

/**
 * Retrieves all of a user's flashcard decks from MongoDB and populates the `flashcards` field with an array of flashcards
 * that are tied to the deck's objectId.
 *
 * @param userId
 * @returns decks
 */
export async function getDecks(userId) {

    const decks = await FlashcardDeck.find({ user: userId })
        .populate("flashcards");

    if (!decks) {
        const error = new Error("No decks found.");
        error.status = 404;
        throw error;
    }

    return decks;

}