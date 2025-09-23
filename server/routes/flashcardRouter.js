import express from "express";
import * as deckController from "../controllers/deckController.js";
import * as flashcardController from "../controllers/flashcardController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";

const flashcardRouter = express.Router();

flashcardRouter.get("/", authenticateJWT, deckController.getDecks);
flashcardRouter.post("/", authenticateJWT, deckController.createDeck);
flashcardRouter.get("/:deckId", authenticateJWT, deckController.getDeck);
flashcardRouter.put("/:deckId", authenticateJWT, deckController.updateDeck);
flashcardRouter.delete("/:deckId", authenticateJWT, deckController.deleteDeck);

flashcardRouter.post("/:deckId/flashcards", authenticateJWT, flashcardController.addFlashcard);
flashcardRouter.put("/:deckId/flashcards/:flashcardId", authenticateJWT, flashcardController.updateFlashcard);
flashcardRouter.delete("/:deckId/flashcards/:flashcardId", authenticateJWT, flashcardController.deleteFlashcard);

export default flashcardRouter;