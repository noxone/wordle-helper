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


const LANGUAGE_STORAGE_KEY = "wordle-helper.language";

function parseWordListText(text: string): string[] {
    return text
        .split("\n")
        .map((word) => word.trim())
        .filter((word) => word !== "");
}


export type FetchWordListText = (path: string) => Promise<string>;

export async function loadWordList(fetchText: FetchWordListText, locale = "en"): Promise<string[]> {
    const text = await fetchText(`/${locale}/5.txt`);

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


export interface ReadLanguageStorage {
    getItem(key: string): string | null;
}

export function restoreSelectedLocale(storage: ReadLanguageStorage): string | null {
    return storage.getItem(LANGUAGE_STORAGE_KEY);
}
