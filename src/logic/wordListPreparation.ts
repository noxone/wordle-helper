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

export function prepareWordList(words: string[], wordLength: number): string[] {
    return words
        .map((word) => word.normalize("NFC").toLowerCase())
        .filter((word) => /^\p{L}+$/u.test(word))
        .filter((word) => Array.from(word).length === wordLength);
}


export interface WritePreparedWordListOptions {
    language: string;
    wordLength: number;
    words: string[];
    publicDir: string;
}

export async function writePreparedWordList(options: WritePreparedWordListOptions): Promise<void> {
    const { mkdir, writeFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const words = prepareWordList(options.words, options.wordLength);
    const outputDir = join(options.publicDir, options.language);

    await mkdir(outputDir, { recursive: true });
    await writeFile(join(outputDir, `${options.wordLength}.txt`), `${words.join("\n")}\n`);
}
