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
    browserLocale?: string;
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
        browserLocale: options.browserLocale ?? "en-US",
        fetchText: fetchText as FetchWordListText,
    });

    return { fetchText, storage };
}

describe("initializeApp", () => {
    it("covers application initialization with a browser-environment smoke test", async () => {
        renderAppShell();
        const fetchText = vi.fn().mockResolvedValue("CRANE\nSLATE\n");

        await initializeTestApp({ fetchText });

        expect(document.querySelectorAll("#correct-row input")).toHaveLength(5);
        expect(document.querySelectorAll("#present-row input")).toHaveLength(5);
        expect(document.querySelector<HTMLSelectElement>("#language")?.value).toBe("en");
        expect(document.querySelector<HTMLSelectElement>("#word-length")?.value).toBe("5");
        expect(document.querySelector("#count")?.textContent).toBe("2 Wörter gefunden.");
        expect(Array.from(document.querySelectorAll("#results li")).map((li) => li.textContent)).toEqual([
            "CRANE",
            "SLATE",
        ]);
    });

    it("initializes the app without making a real network request", async () => {
        renderAppShell();
        const fetchText = vi.fn().mockResolvedValue("CRANE\n");

        await initializeTestApp({ fetchText });

        expect(fetchText).toHaveBeenCalledWith("/en/5.txt");
        expect(document.querySelector("#count")?.textContent).toBe("1 Wort gefunden.");
    });

    it("initializes the app with mocked localStorage", async () => {
        renderAppShell();
        const storage = {
            getItem: vi.fn((key: string) => key === "wordle-helper.language" ? "de" : "6"),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn().mockResolvedValue("HÄUSER\n");

        await initializeTestApp({ fetchText, storage });

        expect(storage.getItem).toHaveBeenCalledWith("wordle-helper.language");
        expect(storage.getItem).toHaveBeenCalledWith("wordle-helper.wordLength");
        expect(document.querySelector<HTMLSelectElement>("#language")?.value).toBe("de");
        expect(document.querySelector<HTMLSelectElement>("#word-length")?.value).toBe("6");
    });

    it("initializes the app with mocked navigator.language", async () => {
        renderAppShell();
        const fetchText = vi.fn().mockResolvedValue("ÄPFEL\n");

        await initializeTestApp({ browserLocale: "de-DE", fetchText });

        expect(document.querySelector<HTMLSelectElement>("#language")?.value).toBe("de");
        expect(fetchText).toHaveBeenCalledWith("/de/5.txt");
    });

    it("connects language selection, word-length selection, state updates, and rendered results during startup", async () => {
        renderAppShell();
        const storage = {
            getItem: vi.fn((key: string) => key === "wordle-helper.language" ? "de" : "6"),
            setItem: vi.fn(),
        };
        const fetchText = vi.fn().mockResolvedValue("HÄUSER\nKRÄUTER\n");

        await initializeTestApp({ fetchText, storage });

        expect(fetchText).toHaveBeenCalledWith("/de/6.txt");
        expect(document.querySelectorAll("#correct-row input")).toHaveLength(6);
        expect(document.querySelectorAll("#present-row input")).toHaveLength(6);
        expect(document.querySelector("#count")?.textContent).toBe("2 Wörter gefunden.");
        expect(Array.from(document.querySelectorAll("#results li")).map((li) => li.textContent)).toEqual([
            "HÄUSER",
            "KRÄUTER",
        ]);
    });
});
