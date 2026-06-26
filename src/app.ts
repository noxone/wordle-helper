import { ALLOWED_CHARACTERS_REGEX, DISALLOWED_CHARACTERS_REGEX, DEFAULT_WORD_LENGTH } from "./constants.ts";
import { WordleState } from "./state/store";
import { createLetterRow } from "./components/LetterRow";
import { renderPresentConfig } from "./components/PresentLetters.ts";
import { createAbsentLetters } from "./components/AbsentLetters.ts";
import { PossibleWords } from "./components/PossibleWords.ts";
import { initializeLanguageSelection } from "./browser/languageSelection.ts";
import type { FetchWordListText, LanguageStorage, ReadLanguageStorage } from "./logic/languages";

export interface InitializeAppOptions {
    browserLocale: string;
    document: Document;
    fetchText: FetchWordListText;
    storage: LanguageStorage & ReadLanguageStorage;
}

export async function initializeApp(options: InitializeAppOptions): Promise<void> {
    function getRequiredElement<T extends HTMLElement>(id: string): T {
        return options.document.getElementById(id) as T;
    }

    const correctRow = getRequiredElement("correct-row");
    const presentRow = getRequiredElement("present-row");
    const absentInput = getRequiredElement<HTMLInputElement>("absent");
    const resetButton = getRequiredElement<HTMLButtonElement>("reset");
    const resultsListElement = getRequiredElement("results");
    const countElement = getRequiredElement("count");
    const presentConfig = getRequiredElement("present-config");
    const languageSelect = getRequiredElement<HTMLSelectElement>("language");
    const wordLengthSelect = getRequiredElement<HTMLSelectElement>("word-length");

    const possibleWordsList = new PossibleWords(resultsListElement, countElement);

    const wordleState = new WordleState(
        DEFAULT_WORD_LENGTH,
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

    function clearConstraintInputs(): void {
        correctLetters.clear();
        presentLetters.clear();
        absentInput.value = "";
        presentConfig.innerHTML = "";
    }

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

    renderLetterInputs(DEFAULT_WORD_LENGTH);

    createAbsentLetters(
        absentInput,
        ALLOWED_CHARACTERS_REGEX,
        DISALLOWED_CHARACTERS_REGEX,
        wordleState
    );

    resetButton.addEventListener("click", () => {
        clearConstraintInputs();
        wordleState.resetConstraints();
        correctLetters.focus(0);
    });

    await initializeLanguageSelection({
        select: languageSelect,
        lengthSelect: wordLengthSelect,
        storage: options.storage,
        browserLocale: options.browserLocale,
        fetchText: options.fetchText,
        wordleState,
        clearConstraintInputs,
        renderLetterInputs,
    });

    correctLetters.focus(0)
}
