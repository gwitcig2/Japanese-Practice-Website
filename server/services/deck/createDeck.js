import FlashcardDeck from "../../models/FlashcardDeck.js";

/**
 * Creates a new flashcard deck for a user and saves it to the MongoDB.
 *
 * @param name
 * @param description
 * @param userId
 * @returns newDeck
 */
export async function createDeck(name, description, userId) {

    const newDeck = new FlashcardDeck({
        name: name,
        description: !description ?  "" : description,
        user: userId,
    });

    await newDeck.save();

    return newDeck;

}