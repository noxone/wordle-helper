import { createLanguageSelector } from "../components/LanguageSelector";
import {
    loadWordList,
    detectSupportedLocale,
    restoreSelectedLocale,
    storeSelectedLocale,
    supportedLanguages,
    type FetchWordListText,
    type LanguageStorage,
    type ReadLanguageStorage,
} from "../logic/languages";

export interface LanguageSelectionState {
    changeLanguage(wordList: string[]): void;
}

export interface InitializeLanguageSelectionOptions {
    select: HTMLSelectElement;
    storage: LanguageStorage & ReadLanguageStorage;
    browserLocale: string;
    fetchText: FetchWordListText;
    wordleState: LanguageSelectionState;
    clearConstraintInputs?: () => void;
}

export async function initializeLanguageSelection(options: InitializeLanguageSelectionOptions): Promise<void> {
    const locale = restoreSelectedLocale(options.storage) ?? detectSupportedLocale(options.browserLocale);

    createLanguageSelector(options.select, supportedLanguages, locale, (selectedLocale) => {
        storeSelectedLocale(options.storage, selectedLocale);
        loadWordList(options.fetchText, selectedLocale).then((wordList) => {
            options.wordleState.changeLanguage(wordList);
            options.clearConstraintInputs?.();
        });
    });

    const wordList = await loadWordList(options.fetchText, locale);
    options.wordleState.changeLanguage(wordList);
}
