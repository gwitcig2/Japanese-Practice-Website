
import React, { useState } from "react";
// import TokenWord from "./TokenWord.tsx";
import WordDefinitionModal from "./WordDefinitionModal.tsx";
import FuriganaWord from "./FuriganaWord.tsx";

type Sense = {
    pos: string[];
    meanings: string[];
    misc: string[];
    info: string[];
    appliesToKanji: string[];
    appliesToKana: string[];
    _id: string;
};

type Token = {
    surface_form: string;
    basic_form: string;
    reading: string;
    senses?: Sense[];
};

type Props = {
    tokens: Token[] | null;
};

const SentenceViewer: React.FC<Props> = ({ tokens }) => {
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);

    if (tokens === null) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1 text-lg">
            {tokens.map((t, i) => (
                <FuriganaWord key={i} token={t} onClick={() => setSelectedToken(t)} />
            ))}

            {selectedToken && (
                <WordDefinitionModal
                    token={selectedToken}
                    onClose={() => setSelectedToken(null)}
                />
            )}
        </div>
    );
};

export default SentenceViewer;
