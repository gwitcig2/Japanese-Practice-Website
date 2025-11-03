import express from "express";
import * as deckController from "../controllers/deckController.js";
import * as flashcardController from "../controllers/flashcardController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";

const flashcardRouter = express.Router();

flashcardRouter.get("/", authenticateJWT, deckController.handleGetDecks);
flashcardRouter.post("/", authenticateJWT, deckController.handleCreateDeck);
flashcardRouter.get("/:deckId", authenticateJWT, deckController.handleGetDeck);
flashcardRouter.put("/:deckId", authenticateJWT, deckController.handleUpdateDeck);
flashcardRouter.delete("/:deckId", authenticateJWT, deckController.handleDeleteDeck);

flashcardRouter.post("/:deckId/flashcards", authenticateJWT, flashcardController.handleAddFlashcard);
flashcardRouter.put("/:deckId/flashcards/:flashcardId", authenticateJWT, flashcardController.handleUpdateFlashcard);
flashcardRouter.delete("/:deckId/flashcards/:flashcardId", authenticateJWT, flashcardController.handleDeleteFlashcard);

export default flashcardRouter;