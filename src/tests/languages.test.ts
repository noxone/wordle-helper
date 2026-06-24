import { describe, expect, it, vi } from "vitest";
import {
    detectSupportedLocale,
    getAvailableWordLengths,
    loadWordList,
    restoreSelectedLocale,
    resolveSelectedWordLength,
    storeSelectedLocale,
    storeSelectedWordLength,
    supportedLanguages,
} from "../logic/languages";

describe("supportedLanguages", () => {
    it("exposes all supported languages with their locale codes and labels", () => {
        expect(supportedLanguages.map((language) => [language.locale, language.label])).toEqual([
            ["de", "Deutsch"],
            ["en", "English"],
            ["es", "Español"],
            ["fr", "Français"],
            ["it", "Italiano"],
            ["nl", "Nederlands"],
            ["da", "Dansk"],
            ["no", "Norsk"],
        ]);
    });
});

describe("getAvailableWordLengths", () => {
    it("exposes available word lengths per supported language", () => {
        expect(getAvailableWordLengths("de")).toEqual([4, 5, 6, 7]);
        expect(getAvailableWordLengths("en")).toEqual([4, 5, 6, 7]);
        expect(getAvailableWordLengths("da")).toEqual([4, 5, 6, 7]);
    });
});

describe("loadWordList", () => {
    it("loads the English word list by default", async () => {
        const fetchText = vi.fn().mockResolvedValue("crane\nhouse\n");

        await expect(loadWordList(fetchText)).resolves.toEqual(["crane", "house"]);
        expect(fetchText).toHaveBeenCalledWith("/en/5.txt");
    });


    it("loads the selected language word list when the language changes", async () => {
        const fetchText = vi.fn().mockResolvedValue("äpfel\nkräne\n");

        await expect(loadWordList(fetchText, "de")).resolves.toEqual(["äpfel", "kräne"]);
        expect(fetchText).toHaveBeenCalledWith("/de/5.txt");
    });


    it("loads the selected length word list for the current language", async () => {
        const fetchText = vi.fn().mockResolvedValue("häuser\nkräuter\n");

        await expect(loadWordList(fetchText, "de", 6)).resolves.toEqual(["häuser", "kräuter"]);
        expect(fetchText).toHaveBeenCalledWith("/de/6.txt");
    });
});

describe("detectSupportedLocale", () => {
    it("detects a supported browser locale on first load", () => {
        expect(detectSupportedLocale("de-DE")).toBe("de");
    });


    it("falls back to English for an unsupported browser locale", () => {
        expect(detectSupportedLocale("pt-BR")).toBe("en");
    });
});

describe("resolveSelectedWordLength", () => {
    it("loads the default available length when no stored length exists", () => {
        const storage = {
            getItem: vi.fn().mockReturnValue(null),
        };

        expect(resolveSelectedWordLength(storage, "de")).toBe(5);
    });
});

describe("storeSelectedLocale", () => {
    it("stores the selected language in local storage", () => {
        const storage = {
            setItem: vi.fn(),
        };

        storeSelectedLocale(storage, "de");

        expect(storage.setItem).toHaveBeenCalledWith("wordle-helper.language", "de");
    });
});

describe("storeSelectedWordLength", () => {
    it("stores the selected word length in local storage", () => {
        const storage = {
            setItem: vi.fn(),
        };

        storeSelectedWordLength(storage, 6);

        expect(storage.setItem).toHaveBeenCalledWith("wordle-helper.wordLength", "6");
    });
});

describe("restoreSelectedLocale", () => {
    it("restores the stored language on reload", () => {
        const storage = {
            getItem: vi.fn().mockReturnValue("de"),
        };

        expect(restoreSelectedLocale(storage)).toBe("de");
        expect(storage.getItem).toHaveBeenCalledWith("wordle-helper.language");
    });
});
