// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createLanguageSelector } from "../components/LanguageSelector";
import { supportedLanguages } from "../logic/languages";

describe("createLanguageSelector", () => {
    it("renders a language selector with all supported languages", () => {
        const select = document.createElement("select");

        createLanguageSelector(select, supportedLanguages, "de", vi.fn());

        expect(Array.from(select.options).map((option) => [option.value, option.textContent])).toEqual([
            ["de", "Deutsch"],
            ["en", "English"],
            ["es", "Español"],
            ["fr", "Français"],
            ["it", "Italiano"],
            ["nl", "Nederlands"],
            ["da", "Dansk"],
            ["no", "Norsk"],
        ]);
        expect(select.value).toBe("de");
    });
});
