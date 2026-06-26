// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { initializeApp } from "../app";
import type { FetchWordListText, LanguageStorage, ReadLanguageStorage } from "../logic/languages";

function renderAppShell(): void {
    document.body.innerHTML = `
        <select id="language"></select>
        <select id="word-length"></select>
        <div id="correct-row"></div>
        <div id="present-row"></div>
        <input id="absent" />
        <button id="reset" type="button">Zurücksetzen</button>
        <div id="present-config"></div>
        <span id="count"></span>
        <ul id="results"></ul>
    `;
}

async function initializeTestApp(options: {
    fetchText?: ReturnType<typeof vi.fn>;
    storage?: {
        getItem: ReturnType<typeof vi.fn>;
        setItem: ReturnType<typeof vi.fn>;
    };
} = {}) {
    const storage = options.storage ?? {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
    };
    const fetchText = options.fetchText ?? vi.fn().mockResolvedValue("CRANE\n");

    await initializeApp({
        document,
        storage: storage as LanguageStorage & ReadLanguageStorage,
        browserLocale: "en-US",
        fetchText: fetchText as FetchWordListText,
    });

    return { fetchText, storage };
}

function pressKey(input: HTMLInputElement, key: string): void {
    input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("F-6 UX improvements", () => {
    it("renders a reset button", async () => {
        renderAppShell();

        await initializeTestApp();

        expect(document.querySelector<HTMLButtonElement>("#reset")).not.toBeNull();
        expect(document.querySelector<HTMLButtonElement>("#reset")?.textContent).toBe("Zurücksetzen");
    });

    it("clears correct-letter constraints when the reset button is clicked", async () => {
        renderAppShell();
        await initializeTestApp({ fetchText: vi.fn().mockResolvedValue("CRANE\nSLATE\n") });
        const correctInput = document.querySelector<HTMLInputElement>("#correct-row input");

        pressKey(correctInput!, "C");
        expect(Array.from(document.querySelectorAll("#results li")).map((li) => li.textContent)).toEqual(["CRANE"]);

        document.querySelector<HTMLButtonElement>("#reset")?.click();

        expect(correctInput?.value).toBe("");
        expect(Array.from(document.querySelectorAll("#results li")).map((li) => li.textContent)).toEqual([
            "CRANE",
            "SLATE",
        ]);
    });

    it("clears present-letter constraints when the reset button is clicked", async () => {
        renderAppShell();
        await initializeTestApp();
        const presentInput = document.querySelector<HTMLInputElement>("#present-row input");

        pressKey(presentInput!, "R");
        document.querySelector<HTMLButtonElement>("#reset")?.click();

        expect(presentInput?.value).toBe("");
    });

    it("clears absent-letter constraints when the reset button is clicked", async () => {
        renderAppShell();
        await initializeTestApp();
        const absentInput = document.querySelector<HTMLInputElement>("#absent");

        absentInput!.value = "TIOS";
        absentInput?.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelector<HTMLButtonElement>("#reset")?.click();

        expect(absentInput?.value).toBe("");
    });

    it("focuses the first correct-position input when the reset button is clicked", async () => {
        renderAppShell();
        await initializeTestApp();
        const firstCorrectInput = document.querySelector<HTMLInputElement>("#correct-row input");
        const absentInput = document.querySelector<HTMLInputElement>("#absent");

        absentInput?.focus();
        document.querySelector<HTMLButtonElement>("#reset")?.click();

        expect(document.activeElement).toBe(firstCorrectInput);
    });

    it("keeps the selected language when the reset button is clicked", async () => {
        renderAppShell();
        await initializeTestApp({
            storage: {
                getItem: vi.fn((key: string) => key === "wordle-helper.language" ? "de" : "5"),
                setItem: vi.fn(),
            },
            fetchText: vi.fn().mockResolvedValue("ÄPFEL\n"),
        });
        const languageSelect = document.querySelector<HTMLSelectElement>("#language");

        document.querySelector<HTMLButtonElement>("#reset")?.click();

        expect(languageSelect?.value).toBe("de");
    });

    it("keeps the selected word length when the reset button is clicked", async () => {
        renderAppShell();
        await initializeTestApp({
            storage: {
                getItem: vi.fn((key: string) => key === "wordle-helper.language" ? "de" : "6"),
                setItem: vi.fn(),
            },
            fetchText: vi.fn().mockResolvedValue("HÄUSER\n"),
        });
        const wordLengthSelect = document.querySelector<HTMLSelectElement>("#word-length");

        document.querySelector<HTMLButtonElement>("#reset")?.click();

        expect(wordLengthSelect?.value).toBe("6");
    });

    it("shows an empty-results message when no words match", async () => {
        renderAppShell();

        await initializeTestApp({ fetchText: vi.fn().mockResolvedValue("") });

        expect(document.querySelector("#results")?.textContent).toBe("Keine Wörter gefunden. Bitte Eingaben prüfen.");
    });

    it("hides the empty-results message when words match", async () => {
        renderAppShell();

        await initializeTestApp({ fetchText: vi.fn().mockResolvedValue("CRANE\n") });

        expect(document.querySelector("#results")?.textContent).toBe("CRANE");
    });

    it("shows the result count when one word matches", async () => {
        renderAppShell();

        await initializeTestApp({ fetchText: vi.fn().mockResolvedValue("CRANE\n") });

        expect(document.querySelector("#count")?.textContent).toBe("1 Wort gefunden.");
    });

    it("shows the result count when multiple words match", async () => {
        renderAppShell();

        await initializeTestApp({ fetchText: vi.fn().mockResolvedValue("CRANE\nSLATE\nBRICK\n") });

        expect(document.querySelector("#count")?.textContent).toBe("3 Wörter gefunden.");
    });

    it("renders all matching words when more than 10 words match", async () => {
        renderAppShell();
        const words = [
            "WORDA",
            "WORDB",
            "WORDC",
            "WORDD",
            "WORDE",
            "WORDF",
            "WORDG",
            "WORDH",
            "WORDI",
            "WORDJ",
            "WORDK",
        ];

        await initializeTestApp({ fetchText: vi.fn().mockResolvedValue(`${words.join("\n")}\n`) });

        expect(Array.from(document.querySelectorAll("#results li")).map((li) => li.textContent)).toEqual(words);
    });

    it("sizes the results list to fit when 10 or fewer words match", async () => {
        renderAppShell();
        const results = document.querySelector<HTMLUListElement>("#results");
        results?.classList.add("max-h-80", "overflow-y-auto");

        await initializeTestApp({ fetchText: vi.fn().mockResolvedValue("WORDA\nWORDB\nWORDC\nWORDD\nWORDE\nWORDF\nWORDG\nWORDH\nWORDI\nWORDJ\n") });

        expect(results?.classList.contains("max-h-80")).toBe(false);
        expect(results?.classList.contains("overflow-y-auto")).toBe(false);
    });

    it("makes the results list scrollable when more than 10 words match", async () => {
        renderAppShell();
        const words = [
            "WORDA",
            "WORDB",
            "WORDC",
            "WORDD",
            "WORDE",
            "WORDF",
            "WORDG",
            "WORDH",
            "WORDI",
            "WORDJ",
            "WORDK",
        ];

        await initializeTestApp({ fetchText: vi.fn().mockResolvedValue(`${words.join("\n")}\n`) });
        const results = document.querySelector<HTMLUListElement>("#results");

        expect(results?.classList.contains("max-h-80")).toBe(true);
        expect(results?.classList.contains("overflow-y-auto")).toBe(true);
    });
});
