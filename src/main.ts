import "./style.css";
import {ALLOWED_CHARACTERS_REGEX, DISALLOWED_CHARACTERS_REGEX, MAX_CHARACTERS} from "./constants.ts";
import { WordleState} from "./state/store";
import { createLetterRow } from "./components/LetterRow";
import { renderPresentConfig } from "./components/PresentLetters.ts";
import { createAbsentLetters } from "./components/AbsentLetters.ts";
import { PossibleWords } from "./components/PossibleWords.ts";
import { initializeLanguageSelection } from "./browser/languageSelection.ts";

const correctRow = document.getElementById("correct-row")!;
const presentRow = document.getElementById("present-row")!;
const absentInput = document.getElementById("absent") as HTMLInputElement;
const resultsEl = document.getElementById("results")!;
const countEl = document.getElementById("count")!;
const presentConfig = document.getElementById("present-config")!;
const languageSelect = document.getElementById("language") as HTMLSelectElement;
const wordLengthSelect = document.getElementById("word-length") as HTMLSelectElement;

const possibleWordsList = new PossibleWords(resultsEl, countEl);

const wordleState = new WordleState(
    MAX_CHARACTERS,
    (words) => { possibleWordsList.showPossibleWords(words) },
    (state) => {
        renderPresentConfig(
            presentConfig,
            state
        )
    }
);

let correctLetters!: ReturnType<typeof createLetterRow>;
let presentLetters!: ReturnType<typeof createLetterRow>;

function renderLetterInputs(wordLength: number): void {
    correctRow.innerHTML = "";
    presentRow.innerHTML = "";

    correctLetters = createLetterRow(
        correctRow,
        wordLength,
        ALLOWED_CHARACTERS_REGEX,
        true,
        'bg-green-300',
        'focus:bg-green-500',
        (letter) => { return wordleState.isLetterValidForCorrect(letter) },
        (letters) => { wordleState.setCorrectLetters(letters); }
    );

    presentLetters = createLetterRow(
        presentRow,
        wordLength,
        ALLOWED_CHARACTERS_REGEX,
        false,
        'bg-yellow-200',
        'focus:bg-yellow-400',
        (letter) => { return wordleState.isLetterValidForPresent(letter) },
        (letters) => { wordleState.setPresentLetters(letters) }
    );
}

renderLetterInputs(MAX_CHARACTERS);

createAbsentLetters(
    absentInput,
    ALLOWED_CHARACTERS_REGEX,
    DISALLOWED_CHARACTERS_REGEX,
    wordleState
);

await initializeLanguageSelection({
    select: languageSelect,
    lengthSelect: wordLengthSelect,
    storage: localStorage,
    browserLocale: navigator.language,
    fetchText: async (path) => {
        const response = await fetch(path);
        return response.text();
    },
    wordleState,
    clearConstraintInputs: () => {
        correctLetters.clear();
        presentLetters.clear();
        absentInput.value = "";
        presentConfig.innerHTML = "";
    },
    renderLetterInputs,
});

correctLetters.focus(0)
