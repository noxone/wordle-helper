import { describe, expect, it, vi } from "vitest";
import {
    detectSupportedLocale,
    loadWordList,
    restoreSelectedLocale,
    storeSelectedLocale,
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
});

describe("detectSupportedLocale", () => {
    it("detects a supported browser locale on first load", () => {
        expect(detectSupportedLocale("de-DE")).toBe("de");
    });


    it("falls back to English for an unsupported browser locale", () => {
        expect(detectSupportedLocale("pt-BR")).toBe("en");
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

describe("restoreSelectedLocale", () => {
    it("restores the stored language on reload", () => {
        const storage = {
            getItem: vi.fn().mockReturnValue("de"),
        };

        expect(restoreSelectedLocale(storage)).toBe("de");
        expect(storage.getItem).toHaveBeenCalledWith("wordle-helper.language");
    });
});
