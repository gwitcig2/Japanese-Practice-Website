import { useState } from "react";

import SentenceViewer from "./SentenceViewer.tsx";

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
    pos: string;
    surface_form: string;
    basic_form: string;
    reading: string;
    senses?: Sense[];
};

function ReadingPage() {

    const [result, setResult] = useState<Token[] | null>(null);

    const testReadingProcess = async () => {

        const res = await fetch("http://localhost:5000/reading/setupReading", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
            // body: JSON.stringify({ input })
        });
        const data = await res.json();
        setResult(data.tokens);

    };

    return (
        <>
            <div className="flex flex-wrap flex-col gap-1 text-7x1 justify-center">
                <div className="flex justify-center pb-2">
                    <button className="border-3 px-5 py-1" onClick={testReadingProcess}>Click to Test</button>
                </div>


                <SentenceViewer tokens={result} />
            </div>
        </>
    )
}

export default ReadingPage