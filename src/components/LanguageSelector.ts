import type { SupportedLanguage } from "../logic/languages";

export function createLanguageSelector(
    select: HTMLSelectElement,
    languages: SupportedLanguage[],
    selectedLocale: string,
    onChange: (locale: string) => void,
): void {
    select.innerHTML = "";

    languages.forEach((language) => {
        const option = document.createElement("option");
        option.value = language.locale;
        option.textContent = language.label;
        select.appendChild(option);
    });

    select.value = selectedLocale;
    select.addEventListener("change", () => {
        onChange(select.value);
    });
}
