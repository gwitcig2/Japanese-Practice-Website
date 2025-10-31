import { createDeck } from "../services/deck/createDeck.js";
import { getDecks } from "../services/deck/getDecks.js";
import { getDeck } from "../services/deck/getDeck.js";
import { updateDeck } from "../services/deck/updateDeck.js";
import { deleteDeck } from "../services/deck/deleteDeck.js";

/**
 * Handles a user's request to create a new flashcard deck.
 *
 * POST /decks
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function handleCreateDeck(req, res) {

    try {

        const { name, description } = req.body;

        const result = await createDeck(name, description, req.user.userId);

        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

/**
 * Handles a request to retrieve all of a user's flashcard decks.
 *
 * GET /decks
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function handleGetDecks(req, res) {

    try {

        const result = await getDecks(req.user.userId);

        res.status(200).json(result);

    } catch (err) {

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });

    }

}

/**
 * Handles a user's request to retrieve just one of their flashcard decks.
 *
 * GET /decks/:deckId
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function handleGetDeck(req, res) {

    try {

        const { deckId } = req.params;

        const result = await getDeck(deckId, req.user.userId);

        res.status(200).json(result);

    } catch (err) {

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });

    }

}

/**
 * Handles a user's request to update the name and/or description of a flashcard deck.
 *
 * PUT /decks/:deckId
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function handleUpdateDeck(req, res) {

    try {

        const { deckId } = req.params;

        const result = await updateDeck(deckId, req.user.userId, req.body);

        res.status(200).json(result);

    } catch (err) {

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });

    }

}

/**
 * Handles a user's request to delete one of their flashcard decks, and the flashcards inside of them.
 *
 * DELETE /decks/:deckId
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function handleDeleteDeck(req, res) {

    try {

        const { deckId } = req.params;

        await deleteDeck(deckId, req.user.userId);

        res.status(200).json({ message: "Flashcard deck and its flashcards deleted." });

    } catch (err) {

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });

    }

}
