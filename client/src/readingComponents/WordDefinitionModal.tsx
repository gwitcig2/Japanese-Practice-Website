
import React from "react";

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
    token: Token;
    onClose: () => void;
};

const WordDefinitionModal: React.FC<Props> = ({ token, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-4 max-h-100 overflow-auto">
                <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <h2 className="text-xl font-bold">{token.basic_form}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        ✕
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-2">Reading: {token.reading}</p>
                <div className="space-y-3">
                    {token.senses?.map((sense, i) => (
                        <div key={sense._id || i} className="border-l-4 border-blue-400 pl-2">
                            <p className="text-sm text-gray-600">
                                <strong>{sense.pos.join(", ")}</strong>
                            </p>
                            <ul className="list-disc ml-5 text-gray-800">
                                {sense.meanings.map((m, j) => (
                                    <li key={j}>{m}</li>
                                ))}
                            </ul>
                        </div>
                    )) || <p>No definitions found.</p>}
                </div>
            </div>
        </div>
    );
};

export default WordDefinitionModal;