import { populateSelectOptions } from "./SelectOptions";

export function createWordLengthSelector(
    select: HTMLSelectElement,
    wordLengths: number[],
    selectedWordLength: number,
    onChange: (wordLength: number) => void,
): void {
    populateSelectOptions(
        select,
        wordLengths.map((wordLength) => ({ value: String(wordLength), label: String(wordLength) })),
        String(selectedWordLength),
    );

    select.onchange = () => {
        onChange(Number(select.value));
    };
}
