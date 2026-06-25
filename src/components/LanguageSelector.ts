import type { SupportedLanguage } from "../logic/languages";
import { populateSelectOptions } from "./SelectOptions";

export function createLanguageSelector(
    select: HTMLSelectElement,
    languages: SupportedLanguage[],
    selectedLocale: string,
    onChange: (locale: string) => void,
): void {
    populateSelectOptions(
        select,
        languages.map((language) => ({ value: language.locale, label: language.label })),
        selectedLocale,
    );

    select.onchange = () => {
        onChange(select.value);
    };
}
