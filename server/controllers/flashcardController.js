import { addFlashcard } from "../services/flashcard/addFlashcard.js";
import { updateFlashcard } from "../services/flashcard/updateFlashcard.js";
import { deleteFlashcard } from "../services/flashcard/deleteFlashcard.js";


/**
 * Handles a user's request to add a flashcard to one of their flashcard decks.
 *
 * POST /decks/:deckId/flashcards
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function handleAddFlashcard(req, res) {

    try {

        const { deckId } = req.params;
        const { front, back } = req.body;

        const result = await addFlashcard(front, back, req.user.userId, deckId);

        res.status(201).json(result);

    } catch (err) {

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });

    }

}

/**
 * Handles a user's request to update the contents of a flashcard in one of their flashcard decks.
 *
 * PUT /decks/:deckId/flashcards/:flashcardId
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function handleUpdateFlashcard(req, res) {

    try {

        const { deckId, flashcardId } = req.params;

        const result = await updateFlashcard(deckId, flashcardId, req.user.userId, req.body);

        res.status(200).json(result);

    } catch (err) {

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

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
export async function handleDeleteFlashcard(req, res) {

    try {

        const { deckId, flashcardId } = req.params;

        await deleteFlashcard(deckId, flashcardId, req.user.userId);

        res.json({ message: "Flashcard deleted successfully." });

    } catch (err) {

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });

    }

}