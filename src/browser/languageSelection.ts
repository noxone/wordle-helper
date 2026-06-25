import { createLanguageSelector } from "../components/LanguageSelector";
import { createWordLengthSelector } from "../components/WordLengthSelector";
import {
    getAvailableWordLengths,
    loadWordList,
    detectSupportedLocale,
    resolveSelectedWordLength,
    restoreSelectedLocale,
    storeSelectedLocale,
    storeSelectedWordLength,
    supportedLanguages,
    type FetchWordListText,
    type LanguageStorage,
    type ReadLanguageStorage,
} from "../logic/languages";

export interface LanguageSelectionState {
    changeLanguage(wordList: string[]): void;
    changeWordLength?(wordLength: number, wordList: string[]): void;
}

export interface InitializeLanguageSelectionOptions {
    select: HTMLSelectElement;
    lengthSelect?: HTMLSelectElement;
    storage: LanguageStorage & ReadLanguageStorage;
    browserLocale: string;
    fetchText: FetchWordListText;
    wordleState: LanguageSelectionState;
    clearConstraintInputs?: () => void;
    renderLetterInputs?: (wordLength: number) => void;
}

export async function initializeLanguageSelection(options: InitializeLanguageSelectionOptions): Promise<void> {
    let locale = restoreSelectedLocale(options.storage) ?? detectSupportedLocale(options.browserLocale);
    let wordLength = resolveSelectedWordLength(options.storage, locale);

    function applyWordList(length: number, wordList: string[]): void {
        if (options.lengthSelect !== undefined && options.wordleState.changeWordLength !== undefined) {
            options.wordleState.changeWordLength(length, wordList);
        } else {
            options.wordleState.changeLanguage(wordList);
        }
    }

    async function loadAndApplyWordList(length: number, clearConstraints: boolean): Promise<void> {
        const wordList = await loadWordList(options.fetchText, locale, length);
        applyWordList(length, wordList);
        options.renderLetterInputs?.(length);

        if (clearConstraints) {
            options.clearConstraintInputs?.();
        }
    }

    function renderWordLengthSelector(): void {
        if (options.lengthSelect === undefined) {
            return;
        }

        createWordLengthSelector(
            options.lengthSelect,
            getAvailableWordLengths(locale),
            wordLength,
            (selectedWordLength) => {
                wordLength = selectedWordLength;
                storeSelectedWordLength(options.storage, selectedWordLength);
                void loadAndApplyWordList(selectedWordLength, true);
            },
        );
    }

    renderWordLengthSelector();

    createLanguageSelector(options.select, supportedLanguages, locale, (selectedLocale) => {
        locale = selectedLocale;
        wordLength = resolveSelectedWordLength(options.storage, selectedLocale);
        storeSelectedLocale(options.storage, selectedLocale);
        renderWordLengthSelector();
        void loadAndApplyWordList(wordLength, true);
    });

    await loadAndApplyWordList(wordLength, false);
}
