import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildWordLists } from "../logic/wordListBuild";
import { prepareWordList, writePreparedWordList } from "../logic/wordListPreparation";

describe("prepareWordList", () => {
    it("builds an uppercase word list for one language and one word length", () => {
        expect(prepareWordList(["CRANE", "House", "DOG"], 5)).toEqual(["CRANE", "HOUSE"]);
    });

    it("keeps Unicode letters with accents and umlauts unchanged", () => {
        expect(prepareWordList(["CAFE\u0301", "ÄPFEL", "PLAIN"], 4)).toEqual(["CAFÉ"]);
        expect(prepareWordList(["CAFE\u0301", "ÄPFEL", "PLAIN"], 5)).toEqual(["ÄPFEL", "PLAIN"]);
    });

    it("rejects words containing digits, punctuation, whitespace, or symbols", () => {
        expect(prepareWordList(["CRANE", "ab12e", "co-op", "ab cd", "$mile"], 5)).toEqual(["CRANE"]);
    });

    it("writes generated word lists to public language and length paths", async () => {
        const publicDir = await mkdtemp(join(tmpdir(), "wordle-helper-"));

        await writePreparedWordList({
            language: "de",
            wordLength: 5,
            words: ["ÄPFEL", "HAUS", "ab12e"],
            publicDir,
        });

        await expect(readFile(join(publicDir, "de", "5.txt"), "utf8")).resolves.toBe("ÄPFEL\n");
    });

    it("builds configured word lists from source files into the public directory", async () => {
        const dataDir = await mkdtemp(join(tmpdir(), "wordle-helper-data-"));
        const publicDir = await mkdtemp(join(tmpdir(), "wordle-helper-public-"));

        await writePreparedWordList({
            language: "source",
            wordLength: 5,
            words: ["CRANE", "HOUSE", "DOG"],
            publicDir: dataDir,
        });

        await buildWordLists({
            dataDir,
            publicDir,
            sources: [{ language: "en", path: "source/5.txt" }],
            wordLengths: [5],
        });

        await expect(readFile(join(publicDir, "en", "5.txt"), "utf8")).resolves.toBe("CRANE\nHOUSE\n");
    });
});
