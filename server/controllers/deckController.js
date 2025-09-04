
import FlashcardDeck from "../models/FlashcardDeck.js";

// TODO: Route to these functions in a new router file and unit test them

/**
 * Creates a new flashcard deck for a user and saves it to MongoDB.
 *
 * POST /decks
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function createDeck(req, res) {

    try {
        const { name, description } = req.body;

        const newDeck = new FlashcardDeck({
            name: name,
            description: description,
            user: req.user._id,
        });

        await newDeck.save();

        res.status(201).json(newDeck);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/**
 * Retrieves all of a user's flashcard decks from MongoDB and populates the `flashcards` field with intended flashcards.
 *
 * GET /decks
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function getDecks(req, res) {

    try {
        const decks = await FlashcardDeck.find({ user: req.user._id })
            .populate("flashcards");

        if (!decks) {
            res.status(404).json({ error: "Flashcard decks not found."})
        }

        res.json(decks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/**
 * Retrieves one flashcard deck based on its objectId and the user's objectId.
 *
 * GET /decks/:deckId
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function getDeck(req, res) {

    try {
        const { deckId } = req.params;
        const deck = await FlashcardDeck.findOne({ _id: deckId, user: req.user._id })
            .populate("flashcards"); // populate may be unnecessary here or in getDecks, I'm not sure which one is the impostor

        if (!deck) {
            res.status(404).json({ error: "Flashcard deck not found." });
        }

        res.json(deck);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/**
 * Updates the name and/or description of a flashcard deck.
 *
 * PUT /decks/:deckId
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function updateDeck(req, res) {

    try {
        const { deckId } = req.params;
        const updatedDeck = await FlashcardDeck.findOneAndUpdate(
            { _id: deckId, user: req.user._id },
            req.body,
            { returnDocument: 'after' }
        );

        if (!updatedDeck) {
            res.status(404).json({ error: "Flashcard deck not found." });
        }

        res.json(updatedDeck);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/**
 * Deletes one user's flashcard deck, and corresponding flashcards undergo cascade deletion.
 *
 * DELETE /decks/:deckId
 *
 * // TODO: Implement cascade deletion middleware
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function deleteDeck(req, res) {

    try {
        const { deckId } = req.params;
        const deletedDeck = await FlashcardDeck.findOneAndDelete({
            _id: deckId,
            user: req.user._id,
        });

        if (!deletedDeck) {
            res.status(404).json({ error: "Flashcard deck not found." });
        }

        res.json({ message: "Flashcard deck and its flashcards deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};
