// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { initializeLanguageSelection, type LanguageSelectionState } from "../browser/languageSelection";
import type { FetchWordListText } from "../logic/languages";
import { WordleState } from "../state/store";

async function waitForLanguageChange(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
}

type SelectionSetupOptions = {
    browserLocale?: string;
    clearConstraintInputs?: ReturnType<typeof vi.fn>;
    fetchText?: ReturnType<typeof vi.fn>;
    language?: string | null;
    renderLetterInputs?: ReturnType<typeof vi.fn>;
    withLength?: boolean;
    wordLength?: string;
    wordleState?: { changeLanguage: ReturnType<typeof vi.fn>; changeWordLength?: ReturnType<typeof vi.fn> } | WordleState;
};

function createStorage(language: string | null, wordLength: string) {
    return {
        getItem: vi.fn((key: string) => key === "wordle-helper.language" ? language : wordLength),
        setItem: vi.fn(),
    };
}

async function setupSelection(options: SelectionSetupOptions = {}) {
    const select = document.createElement("select");
    const lengthSelect = document.createElement("select");
    const storage = createStorage(options.language ?? "de", options.wordLength ?? "5");
    const fetchText = options.fetchText ?? vi.fn().mockResolvedValue("äpfel\n");
    const wordleState = options.wordleState ?? { changeLanguage: vi.fn(), changeWordLength: vi.fn() };

    await initializeLanguageSelection({
        select,
        ...(options.withLength ? { lengthSelect } : {}),
        storage,
        browserLocale: options.browserLocale ?? "en-US",
        fetchText: fetchText as FetchWordListText,
        wordleState: wordleState as LanguageSelectionState,
        clearConstraintInputs: options.clearConstraintInputs as (() => void) | undefined,
        renderLetterInputs: options.renderLetterInputs as ((wordLength: number) => void) | undefined,
    });

    return { fetchText, lengthSelect, select, storage, wordleState };
}

async function changeSelection(select: HTMLSelectElement, value: string): Promise<void> {
    select.value = value;
    select.dispatchEvent(new Event("change"));
    await waitForLanguageChange();
}

describe("initializeLanguageSelection", () => {
    it("selects the restored language on startup", async () => {
        const { select } = await setupSelection({ language: "de" });

        expect(select.value).toBe("de");
    });


    it("selects the detected browser language when no stored language exists", async () => {
        const { select } = await setupSelection({ browserLocale: "de-DE", language: null });

        expect(select.value).toBe("de");
    });


    it("loads the selected word list on startup", async () => {
        const fetchText = vi.fn().mockResolvedValue("äpfel\nkräne\n");
        const wordleState = { changeLanguage: vi.fn() };

        await setupSelection({ fetchText, language: "de", wordleState });

        expect(fetchText).toHaveBeenCalledWith("/de/5.txt");
        expect(wordleState.changeLanguage).toHaveBeenCalledWith(["äpfel", "kräne"]);
    });


    it("stores the selected language when the selector changes", async () => {
        const { select, storage } = await setupSelection({ language: "en" });

        select.value = "de";
        select.dispatchEvent(new Event("change"));

        expect(storage.setItem).toHaveBeenCalledWith("wordle-helper.language", "de");
    });


    it("loads the selected word list when the selector changes", async () => {
        const fetchText = vi.fn()
            .mockResolvedValueOnce("crane\n")
            .mockResolvedValueOnce("äpfel\n");
        const wordleState = { changeLanguage: vi.fn() };
        const { select } = await setupSelection({ fetchText, language: "en", wordleState });

        await changeSelection(select, "de");

        expect(fetchText).toHaveBeenLastCalledWith("/de/5.txt");
        expect(wordleState.changeLanguage).toHaveBeenLastCalledWith(["äpfel"]);
    });

    it("resets the state constraints when the selector changes", async () => {
        const fetchText = vi.fn()
            .mockResolvedValueOnce("crane\n")
            .mockResolvedValueOnce("äpfel\n");
        const wordleState = new WordleState(5, vi.fn(), vi.fn());
        const { select } = await setupSelection({ fetchText, language: "en", wordleState });

        wordleState.setCorrectLetters(["C", "", "", "", ""]);
        wordleState.setPresentLetters(["R", "", "", "", ""]);
        wordleState.setPresentRule("R", 0, true);
        wordleState.setAbsentLetters("T");

        await changeSelection(select, "de");

        expect(wordleState.getCorrectLetters()).toEqual(["", "", "", "", ""]);
        expect(wordleState.getPresentLetters()).toEqual(["", "", "", "", ""]);
        expect(wordleState.getPresentRules()).toEqual({});
        expect(wordleState.isLetterValidForCorrect("T")).toBe(true);
    });


    it("clears visible constraint inputs when the selector changes", async () => {
        const fetchText = vi.fn()
            .mockResolvedValueOnce("crane\n")
            .mockResolvedValueOnce("äpfel\n");
        const clearConstraintInputs = vi.fn();
        const wordleState = { changeLanguage: vi.fn() };
        const { select } = await setupSelection({ clearConstraintInputs, fetchText, language: "en", wordleState });

        await changeSelection(select, "de");

        expect(clearConstraintInputs).toHaveBeenCalledOnce();
    });


    it("selects the restored word length on startup", async () => {
        const { lengthSelect } = await setupSelection({ language: "de", withLength: true, wordLength: "6" });

        expect(lengthSelect.value).toBe("6");
    });


    it("loads the selected word list on startup", async () => {
        const fetchText = vi.fn().mockResolvedValue("häuser\n");
        const wordleState = { changeLanguage: vi.fn(), changeWordLength: vi.fn() };

        await setupSelection({ fetchText, language: "de", withLength: true, wordLength: "6", wordleState });

        expect(fetchText).toHaveBeenCalledWith("/de/6.txt");
        expect(wordleState.changeWordLength).toHaveBeenCalledWith(6, ["häuser"]);
    });


    it("stores the selected word length when the selector changes", async () => {
        const { lengthSelect, storage } = await setupSelection({ language: "de", withLength: true, wordLength: "5" });

        lengthSelect.value = "6";
        lengthSelect.dispatchEvent(new Event("change"));

        expect(storage.setItem).toHaveBeenCalledWith("wordle-helper.wordLength", "6");
    });


    it("loads the selected word list when the selector changes", async () => {
        const fetchText = vi.fn()
            .mockResolvedValueOnce("äpfel\n")
            .mockResolvedValueOnce("häuser\n");
        const wordleState = { changeLanguage: vi.fn(), changeWordLength: vi.fn() };
        const { lengthSelect } = await setupSelection({ fetchText, language: "de", withLength: true, wordLength: "5", wordleState });

        await changeSelection(lengthSelect, "6");

        expect(fetchText).toHaveBeenLastCalledWith("/de/6.txt");
        expect(wordleState.changeWordLength).toHaveBeenLastCalledWith(6, ["häuser"]);
    });


    it("resets the state constraints when the selector changes", async () => {
        const fetchText = vi.fn()
            .mockResolvedValueOnce("äpfel\n")
            .mockResolvedValueOnce("häuser\n");
        const wordleState = new WordleState(5, vi.fn(), vi.fn());
        const { lengthSelect } = await setupSelection({ fetchText, language: "de", withLength: true, wordLength: "5", wordleState });

        wordleState.setCorrectLetters(["C", "", "", "", ""]);
        wordleState.setPresentLetters(["R", "", "", "", ""]);
        wordleState.setPresentRule("R", 0, true);
        wordleState.setAbsentLetters("T");

        await changeSelection(lengthSelect, "6");

        expect(wordleState.getCorrectLetters()).toEqual(["", "", "", "", "", ""]);
        expect(wordleState.getPresentLetters()).toEqual(["", "", "", "", "", ""]);
        expect(wordleState.getPresentRules()).toEqual({});
        expect(wordleState.isLetterValidForCorrect("T")).toBe(true);
    });


    it("re-renders correct-letter inputs to match the selected word length", async () => {
        const fetchText = vi.fn()
            .mockResolvedValueOnce("äpfel\n")
            .mockResolvedValueOnce("häuser\n");
        const renderLetterInputs = vi.fn();
        const { lengthSelect } = await setupSelection({ fetchText, language: "de", renderLetterInputs, withLength: true, wordLength: "5" });

        await changeSelection(lengthSelect, "6");

        expect(renderLetterInputs).toHaveBeenLastCalledWith(6);
    });


    it("re-renders present-letter inputs to match the selected word length", async () => {
        const fetchText = vi.fn()
            .mockResolvedValueOnce("äpfel\n")
            .mockResolvedValueOnce("häuser\n");
        const renderLetterInputs = vi.fn();
        const { lengthSelect } = await setupSelection({ fetchText, language: "de", renderLetterInputs, withLength: true, wordLength: "5" });

        await changeSelection(lengthSelect, "6");

        expect(renderLetterInputs).toHaveBeenLastCalledWith(6);
    });


    it("clears visible constraint inputs when the selector changes", async () => {
        const fetchText = vi.fn()
            .mockResolvedValueOnce("äpfel\n")
            .mockResolvedValueOnce("häuser\n");
        const clearConstraintInputs = vi.fn();
        const { lengthSelect } = await setupSelection({ clearConstraintInputs, fetchText, language: "de", withLength: true, wordLength: "5" });

        await changeSelection(lengthSelect, "6");

        expect(clearConstraintInputs).toHaveBeenCalledOnce();
    });
});
