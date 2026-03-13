import "./style.css";
import {ALLOWED_CHARACTERS_REGEX, DISALLOWED_CHARACTERS_REGEX, MAX_CHARACTERS, WORD_LIST_URI} from "./constants.ts";
import { WordleState} from "./state/store";
import { createLetterRow } from "./components/LetterRow";
import { renderPresentConfig } from "./components/PresentLetters.ts";
import { createAbsentLetters } from "./components/AbsentLetters.ts";
import { PossibleWords } from "./components/PossibleWords.ts";

const correctRow = document.getElementById("correct-row")!;
const presentRow = document.getElementById("present-row")!;
const absentInput = document.getElementById("absent") as HTMLInputElement;
const resultsEl = document.getElementById("results")!;
const countEl = document.getElementById("count")!;
const presentConfig = document.getElementById("present-config")!;

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

const correctLetters = createLetterRow(
    correctRow,
    MAX_CHARACTERS,
    ALLOWED_CHARACTERS_REGEX,
    true,
    'bg-green-300',
    'focus:bg-green-500',
    (letter) => { return wordleState.isLetterValidForCorrect(letter) },
    (letters) => { wordleState.setCorrectLetters(letters); }
);

const presentLetters = createLetterRow(
    presentRow,
    MAX_CHARACTERS,
    ALLOWED_CHARACTERS_REGEX,
    false,
    'bg-yellow-200',
    'focus:bg-yellow-400',
    (letter) => { return wordleState.isLetterValidForPresent(letter) },
    (letters) => { wordleState.setPresentLetters(letters) }
);

createAbsentLetters(
    absentInput,
    ALLOWED_CHARACTERS_REGEX,
    DISALLOWED_CHARACTERS_REGEX,
    wordleState
);

wordleState.loadWordList(WORD_LIST_URI);
correctLetters.focus(0)
