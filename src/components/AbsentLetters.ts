import type {WordleState} from "../state/store.ts";

export function createAbsentLetters(
    absentInput: HTMLInputElement,
    allowedCharacters: RegExp,
    disallowedCharacters: RegExp,
    wordleState: WordleState,
) {
    absentInput.pattern = allowedCharacters.source;
    absentInput.autocomplete = 'off'
    absentInput.addEventListener("input", () => {
        const uniqueLetters = new Set(absentInput.value
            .toUpperCase()
            .replace(disallowedCharacters, "")
            .split(''));
        wordleState.getPresentLetters().forEach((letter) => {uniqueLetters.delete(letter); });
        wordleState.getCorrectLetters().forEach((letter) => {uniqueLetters.delete(letter); });
        const clean = Array.from(uniqueLetters.values())
            .join('');
        absentInput.value = clean;
        wordleState.setAbsentLetters(clean)
    });
}

