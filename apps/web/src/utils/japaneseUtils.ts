/**
 * Converts all Katakana characters in a string to Hiragana.
 *
 * @param input
 */
export function katakanaToHiragana(input: string): string {
    return input.replace(/[\u30a1-\u30f6]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}

/**
 * Checks if `char` is kana (Hiragana or Katakana).
 *
 * @param char
 */
export function isKana(char: string): boolean {
    return (
        (char >= "ぁ" && char <= "ん") || // hiragana
        (char >= "ァ" && char <= "ン") || // katakana
        char === "ー" // long vowel mark
    );
}