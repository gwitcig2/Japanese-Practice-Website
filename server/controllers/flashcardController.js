import FlashcardDeck from "../models/FlashcardDeck.js";
import Flashcard from "../models/Flashcard.js";

/**
 * Adds a Flashcard to a user's flashcard deck.
 *
 * POST /decks/:deckId/flashcards
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function addFlashcard(req, res) {

    try {

        const { deckId } = req.params;
        const { front, back } = req.body;

        const deck = await FlashcardDeck.findOne({ _id: deckId, user: req.user.userId });
        if (!deck) res.status(404).json({ error: "No deck found." });

        if (deck.flashcards.length >= 100) {
            res.status(400).json({ error: "Flashcard limit on this deck exceeded." });
        }

        const flashcard = await Flashcard.create({ front, back, deck: deckId});
        deck.flashcards.push(flashcard._id);
        await deck.save();

        res.status(201).json(flashcard);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/**
 * Updates the content in the front and/or back of a flashcard in a deck.
 *
 * PUT /decks/:deckId/flashcards/:flashcardId
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function updateFlashcard(req, res) {

    try {

        const { deckId, flashcardId } = req.params;

        const deck = await FlashcardDeck.findOne({ _id: deckId, user: req.user.userId });
        if (!deck) res.status(404).json({ error: "No deck found." });

        const flashcard = await Flashcard.findOneAndUpdate(
            { _id: flashcardId, deck: deckId },
            req.body,
            { returnDocument: 'after' }
        );

        if (!flashcard) res.status(404).json({ error: "Flashcard not found." });

        res.json(flashcard);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/**
 * Removes one flashcard from a user's deck.
 *
 * DELETE /decks/:deckId/flashcards/:flashcardId
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function deleteFlashcard(req, res) {

    try {

        const { deckId, flashcardId } = req.params;

        const deck = await FlashcardDeck.findOne({ _id: deckId, user: req.user.userId });
        if (!deck) res.status(404).json({ error: "No deck found." });

        const flashcard = await Flashcard.findOneAndDelete({ _id: flashcardId, deck: deckId });
        if (!flashcard) res.status(404).json({ error: "Flashcard not found." });

        deck.flashcards = deck.flashcards.filter(
            (id) => id.toString() !== flashcardId
        );
        await deck.save();

        res.json({ message: "Flashcard deleted successfully." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}