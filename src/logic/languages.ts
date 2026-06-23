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
