// import React from "react";

import { fit } from "furigana";
import { katakanaToHiragana } from "../../utils/japaneseUtils.ts";
import ReactFurigana from "react-furigana";

import React from "react";

type Props = {
    token: { surface_form: string, reading: string, pos: string },
    onClick: () => void;
};

const FuriganaWord: React.FC<Props> = ({ token, onClick }) => {
    const { surface_form, reading, pos } = token;

    if (pos === "記号") return <span>{ surface_form }</span>;

    const readingHiragana = katakanaToHiragana(reading);

    let appendFurigana: string = surface_form;
    const result: string | null = fit(surface_form, readingHiragana);
    if (result !== null) {
        appendFurigana = result;
    }

    return (
        <span className="cursor-pointer rounded hover:bg-yellow-200 transition py-3" onClick={() => onClick()}>
            <ReactFurigana text={appendFurigana} />
        </span>
    );
}

export default FuriganaWord;