
import { useEffect, useState } from "react";
// import axios from "axios";
import { Button } from "@src/components/ui/button";
import { FlashcardCard } from "./FlashcardCard.tsx";
import { Card } from "@src/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@src/components/ui/progress";

interface Flashcard {
    _id: string;
    front: string;
    back: string;
}

export default function DeckViewer() {
    const [queue, setQueue] = useState<Flashcard[]>([]);
    const [initialCount, setInitialCount] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        const fetchDeck = async () => {
            const { data } =                 {
                data: [{
                    _id: "sdefklj",
                    front: "BROOOOO",
                    back: "weruiog",
                }, {
                    _id: "westside gunn",
                    front: "BRUH",
                    back: "i said im jpegmafia",
                }, {
                    _id: "mach hommmy",
                    front: "predator",
                    back: "prey",
                }]
            };
            // shuffle a little so order isn't always the same
            const initial = (data as Flashcard[]).map((c) => ({ ...c }));

            for (let i = initial.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [initial[i], initial[j]] = [initial[j], initial[i]];
            }
            setQueue(initial);
            setInitialCount(initial.length);
        };
        fetchDeck();
    }, []);

    const currentCard = queue[0] ?? null;
    const completed = initialCount - queue.length;
    const progress = initialCount ? (completed / initialCount) * 100 : 100;

    const handleAnswer = (difficulty: "easy" | "medium" | "hard") => {
        if (isProcessing || !currentCard) return;
        setIsProcessing(true);

        const isLastCard = queue.length === 1;

        const remaining = queue.slice(1);

        if (!isLastCard) {
            if (difficulty === "hard") {
                const insertAt = Math.min(2, remaining.length);
                remaining.splice(insertAt, 0, { ...currentCard });
            } else if (difficulty === "medium") {
                const middle = Math.max(1, Math.floor(remaining.length / 2));
                remaining.splice(middle, 0, { ...currentCard });
            }
        }

        if (isLastCard) {
            setTimeout(() => setQueue([]), 250); // short fade-out
        } else {
            setQueue(remaining);
        }
        setShowButtons(false);
        setIsProcessing(false);
    };


    if (!currentCard) {
        return (
            <Card className="flex flex-col items-center justify-center h-64 text-xl font-semibold px-15">
                🎉 All done! You finished this deck.
                <Button >Return to your Flashcards</Button>
                <Button >Return to the Dashboard</Button>
            </Card>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-8">

            <div className="relative w-80 h-48">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCard._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <FlashcardCard
                            front={currentCard.front}
                            back={currentCard.back}
                            onReveal={() => setShowButtons(true)}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-80 flex flex-col gap-1">
                <p className="text-sm text-muted-foreground mt-1 text-center">
                    Flashcard {completed} of {initialCount}
                </p>
                <Progress value={progress} className="h-" />
            </div>

            <div className="flex gap-3">
                {!showButtons ? (
                    <div className="text-sm text-muted-foreground">Flip the card by clicking on it.</div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-muted-foreground">To proceed, rank how difficult this card was to remember.</div>
                        <div className="flex flex-row items-center justify-center gap-4">
                            <Button
                                variant="destructive"
                                onClick={() => handleAnswer("hard")}
                                disabled={isProcessing}
                            >
                                Hard
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => handleAnswer("medium")}
                                disabled={isProcessing}
                            >
                                Medium
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => handleAnswer("easy")}
                                disabled={isProcessing}
                            >
                                Easy
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
