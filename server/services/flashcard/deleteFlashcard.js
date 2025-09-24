import FlashcardDeck from "../../models/FlashcardDeck.js";
import Flashcard from "../../models/Flashcard.js";

export async function deleteFlashcard(deckId, flashcardId, userId) {

    const deck = await FlashcardDeck.findOne({ _id: deckId, user: userId });

    if (!deck) {
        const error = new Error("Deck not found.");
        error.status = 404;
        throw error;
    }

    const flashcard = await Flashcard.findOneAndDelete({ _id: flashcardId, deck: deckId });

    if (!flashcard) {
        const error = new Error("Flashcard not found.");
        error.status = 404;
        throw error;
    }

    deck.flashcards = deck.flashcards.filter(
        (id) => id.toString() !== flashcardId
    );
    await deck.save();

}