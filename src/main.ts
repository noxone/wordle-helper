import "./style.css";
import {ALLOWED_CHARACTERS_REGEX, DISALLOWED_CHARACTERS_REGEX, MAX_CHARACTERS, WORD_LIST_URI} from "./constants.ts";
import { WordleState} from "./state/store";
import { createLetterRow } from "./components/LetterRow";
import { renderPresentConfig } from "./components/PresentLetters.ts";

const correctRow = document.getElementById("correct-row")!;
const presentRow = document.getElementById("present-row")!;
const absentInput = document.getElementById("absent") as HTMLInputElement;
const resultsEl = document.getElementById("results")!;
const countEl = document.getElementById("count")!;
const presentConfig = document.getElementById("present-config")!;

const wordleState = new WordleState(
    MAX_CHARACTERS,
    showPossibleWords,
    (state) => {
        renderPresentConfig(
            presentConfig,
            state
        )
    }
);

const correctInputs = createLetterRow(
    correctRow,
    MAX_CHARACTERS,
    ALLOWED_CHARACTERS_REGEX,
    'bg-green-300',
    'focus:bg-green-500',
    (letters) => { wordleState.setCorrectLetters(letters); }
);

createLetterRow(
    presentRow,
    MAX_CHARACTERS,
    ALLOWED_CHARACTERS_REGEX,
    'bg-yellow-200',
    'focus:bg-yellow-400',
    (letters) => { wordleState.setPresentLetters(letters) }
);

absentInput.pattern = ALLOWED_CHARACTERS_REGEX.source;
absentInput.autocomplete = 'off'
absentInput.addEventListener("input", () => {
    const clean = absentInput.value
        .toUpperCase()
        .replace(DISALLOWED_CHARACTERS_REGEX, "");
    absentInput.value = clean;
    wordleState.setAbsentLetters(clean)
});

// Wortliste laden
fetch(WORD_LIST_URI)
    .then((r) => r.text())
    .then((text) => {
        const wordList = text
            .split("\n")
            .map((word) => word.trim().toUpperCase())
            .filter((word) => word.length === 5);
        wordleState.setWordList(wordList);
    });

function showPossibleWords(words: string[]) {
    countEl.textContent = String(words.length);

    resultsEl.innerHTML = "";
    words.slice(0, 10).forEach((word) => {
        const li = document.createElement("li");
        li.textContent = word;
        resultsEl.appendChild(li);
    });
}

correctInputs[0].focus()
