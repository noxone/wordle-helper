import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { writePreparedWordList } from "./wordListPreparation.ts";

export interface WordListSource {
    language: string;
    path: string;
}

export interface BuildWordListsOptions {
    dataDir: string;
    publicDir: string;
    sources?: readonly WordListSource[];
    wordLengths?: readonly number[];
}

export const defaultWordLengths: readonly number[] = [4, 5, 6, 7];

export const wordListSources: readonly WordListSource[] = [
    { language: "de", path: "dgwicks.net/deutsch.txt" },
    { language: "en", path: "dgwicks.net/english3.txt" },
    { language: "es", path: "dgwicks.net/espanol.txt" },
    { language: "fr", path: "dgwicks.net/francais.txt" },
    { language: "it", path: "dgwicks.net/italiano.txt" },
    { language: "nl", path: "dgwicks.net/nederlands3.txt" },
    { language: "da", path: "dgwicks.net/dansk.txt" },
    { language: "no", path: "dgwicks.net/norsk.txt" },
];

export async function buildWordLists(options: BuildWordListsOptions): Promise<void> {
    const sources = options.sources ?? wordListSources;
    const wordLengths = options.wordLengths ?? defaultWordLengths;

    for (const source of sources) {
        const text = await readFile(join(options.dataDir, source.path), "utf8");
        const words = text.split(/\r?\n/);

        for (const wordLength of wordLengths) {
            await writePreparedWordList({
                language: source.language,
                publicDir: options.publicDir,
                wordLength,
                words,
            });
        }
    }
}
