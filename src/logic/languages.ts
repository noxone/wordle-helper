export interface SupportedLanguage {
    locale: string;
    label: string;
}

export const supportedLanguages: SupportedLanguage[] = [
    { locale: "de", label: "Deutsch" },
    { locale: "en", label: "English" },
    { locale: "es", label: "Español" },
    { locale: "fr", label: "Français" },
    { locale: "it", label: "Italiano" },
    { locale: "nl", label: "Nederlands" },
    { locale: "da", label: "Dansk" },
    { locale: "no", label: "Norsk" },
];

const availableWordLengthsByLocale: Record<string, number[]> = {
    de: [4, 5, 6, 7],
    en: [4, 5, 6, 7],
    es: [4, 5, 6, 7],
    fr: [4, 5, 6, 7],
    it: [4, 5, 6, 7],
    nl: [4, 5, 6, 7],
    da: [4, 5, 6, 7],
    no: [4, 5, 6, 7],
};

export function getAvailableWordLengths(locale: string): number[] {
    return availableWordLengthsByLocale[locale] ?? [];
}

export function resolveSelectedWordLength(storage: ReadLanguageStorage, locale: string): number {
    const defaultLength = 5;
    const storedLength = Number(storage.getItem(WORD_LENGTH_STORAGE_KEY));
    const availableLengths = getAvailableWordLengths(locale);

    if (availableLengths.includes(storedLength)) {
        return storedLength;
    }

    return availableLengths.includes(defaultLength) ? defaultLength : availableLengths[0];
}


const LANGUAGE_STORAGE_KEY = "wordle-helper.language";
const WORD_LENGTH_STORAGE_KEY = "wordle-helper.wordLength";

function parseWordListText(text: string): string[] {
    return text
        .split("\n")
        .map((word) => word.trim())
        .filter((word) => word !== "");
}


export type FetchWordListText = (path: string) => Promise<string>;

export async function loadWordList(fetchText: FetchWordListText, locale = "en", length = 5): Promise<string[]> {
    const baseUrl = import.meta.env.BASE_URL;
    const wordListUrl = `${baseUrl}${locale}/${length}.txt`;
    const text = await fetchText(wordListUrl);

    return parseWordListText(text);
}


export function detectSupportedLocale(browserLocale: string): string {
    const detectedLocale = browserLocale.split("-")[0];
    const isSupported = supportedLanguages.some((language) => language.locale === detectedLocale);

    return isSupported ? detectedLocale : "en";
}


export interface LanguageStorage {
    setItem(key: string, value: string): void;
}

export function storeSelectedLocale(storage: LanguageStorage, locale: string): void {
    storage.setItem(LANGUAGE_STORAGE_KEY, locale);
}

export function storeSelectedWordLength(storage: LanguageStorage, length: number): void {
    storage.setItem(WORD_LENGTH_STORAGE_KEY, String(length));
}


export interface ReadLanguageStorage {
    getItem(key: string): string | null;
}

export function restoreSelectedLocale(storage: ReadLanguageStorage): string | null {
    return storage.getItem(LANGUAGE_STORAGE_KEY);
}
