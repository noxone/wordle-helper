// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { initializeLanguageSelection } from "../browser/languageSelection";
import { WordleState } from "../state/store";

async function waitForLanguageChange(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
}

describe("initializeLanguageSelection", () => {
    it("selects the restored language on startup", async () => {
        const select = document.createElement("select");
        const storage = {
            getItem: vi.fn().mockReturnValue("de"),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn().mockResolvedValue("äpfel\n");
        const wordleState = { changeLanguage: vi.fn() };

        await initializeLanguageSelection({
            select,
            storage,
            browserLocale: "en-US",
            fetchText,
            wordleState,
        });

        expect(select.value).toBe("de");
    });


    it("selects the detected browser language when no stored language exists", async () => {
        const select = document.createElement("select");
        const storage = {
            getItem: vi.fn().mockReturnValue(null),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn().mockResolvedValue("äpfel\n");
        const wordleState = { changeLanguage: vi.fn() };

        await initializeLanguageSelection({
            select,
            storage,
            browserLocale: "de-DE",
            fetchText,
            wordleState,
        });

        expect(select.value).toBe("de");
    });


    it("loads the selected word list on startup", async () => {
        const select = document.createElement("select");
        const storage = {
            getItem: vi.fn().mockReturnValue("de"),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn().mockResolvedValue("äpfel\nkräne\n");
        const wordleState = { changeLanguage: vi.fn() };

        await initializeLanguageSelection({
            select,
            storage,
            browserLocale: "en-US",
            fetchText,
            wordleState,
        });

        expect(fetchText).toHaveBeenCalledWith("/de/5.txt");
        expect(wordleState.changeLanguage).toHaveBeenCalledWith(["äpfel", "kräne"]);
    });


    it("stores the selected language when the selector changes", async () => {
        const select = document.createElement("select");
        const storage = {
            getItem: vi.fn().mockReturnValue("en"),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn().mockResolvedValue("crane\n");
        const wordleState = { changeLanguage: vi.fn() };

        await initializeLanguageSelection({
            select,
            storage,
            browserLocale: "en-US",
            fetchText,
            wordleState,
        });

        select.value = "de";
        select.dispatchEvent(new Event("change"));

        expect(storage.setItem).toHaveBeenCalledWith("wordle-helper.language", "de");
    });


    it("loads the selected word list when the selector changes", async () => {
        const select = document.createElement("select");
        const storage = {
            getItem: vi.fn().mockReturnValue("en"),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn()
            .mockResolvedValueOnce("crane\n")
            .mockResolvedValueOnce("äpfel\n");
        const wordleState = { changeLanguage: vi.fn() };

        await initializeLanguageSelection({
            select,
            storage,
            browserLocale: "en-US",
            fetchText,
            wordleState,
        });

        select.value = "de";
        select.dispatchEvent(new Event("change"));
        await waitForLanguageChange();

        expect(fetchText).toHaveBeenLastCalledWith("/de/5.txt");
        expect(wordleState.changeLanguage).toHaveBeenLastCalledWith(["äpfel"]);
    });

    it("resets the state constraints when the selector changes", async () => {
        const select = document.createElement("select");
        const storage = {
            getItem: vi.fn().mockReturnValue("en"),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn()
            .mockResolvedValueOnce("crane\n")
            .mockResolvedValueOnce("äpfel\n");
        const wordleState = new WordleState(5, vi.fn(), vi.fn());

        await initializeLanguageSelection({
            select,
            storage,
            browserLocale: "en-US",
            fetchText,
            wordleState,
        });

        wordleState.setCorrectLetters(["C", "", "", "", ""]);
        wordleState.setPresentLetters(["R", "", "", "", ""]);
        wordleState.setPresentRule("R", 0, true);
        wordleState.setAbsentLetters("T");

        select.value = "de";
        select.dispatchEvent(new Event("change"));
        await waitForLanguageChange();

        expect(wordleState.getCorrectLetters()).toEqual(["", "", "", "", ""]);
        expect(wordleState.getPresentLetters()).toEqual(["", "", "", "", ""]);
        expect(wordleState.getPresentRules()).toEqual({});
        expect(wordleState.isLetterValidForCorrect("T")).toBe(true);
    });


    it("clears visible constraint inputs when the selector changes", async () => {
        const select = document.createElement("select");
        const storage = {
            getItem: vi.fn().mockReturnValue("en"),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn()
            .mockResolvedValueOnce("crane\n")
            .mockResolvedValueOnce("äpfel\n");
        const wordleState = { changeLanguage: vi.fn() };
        const clearConstraintInputs = vi.fn();

        await initializeLanguageSelection({
            select,
            storage,
            browserLocale: "en-US",
            fetchText,
            wordleState,
            clearConstraintInputs,
        });

        select.value = "de";
        select.dispatchEvent(new Event("change"));
        await waitForLanguageChange();

        expect(clearConstraintInputs).toHaveBeenCalledOnce();
    });
});
