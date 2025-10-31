import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@src/components/ui/card.tsx";

interface FlashcardCardProps {
    front: string;
    back: string;
    onReveal?: () => void;
}

export function FlashcardCard({ front, back, onReveal }: FlashcardCardProps) {
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        if (flipped) {
            onReveal?.();
        }
    }, [flipped, onReveal]);

    return (
        <div
            className="w-80 h-48 perspective cursor-pointer select-none"
            onClick={() => setFlipped((s) => !s)}
            role="button"
            aria-pressed={flipped}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setFlipped((s) => !s);
                }
            }}
        >
            <motion.div
                className="relative w-full h-full transform-style-preserve-3d"
                animate={{
                    rotateY: flipped ? 180 : 0,
                    scale: flipped ? 1.02 : 1,
                }}
                transition={{
                    duration: 0.2,
                    type: "spring",
                    stiffness: 350,
                    damping: 28,
                }}
            >
                <Card className="absolute w-full h-full backface-hidden flex items-center justify-center text-xl font-medium">
                    <CardContent>{front}</CardContent>
                </Card>

                <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center text-xl font-medium">
                    <CardContent>{back}</CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
