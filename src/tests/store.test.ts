import { describe, expect, it, vi } from "vitest";
import { WordleState } from "../state/store";

describe("WordleState", () => {
    it("resets all letter constraints when the language changes", () => {
        const state = new WordleState(5, vi.fn(), vi.fn());

        state.setCorrectLetters(["C", "", "", "", ""]);
        state.setPresentLetters(["R", "", "", "", ""]);
        state.setPresentRule("R", 0, true);
        state.setAbsentLetters("T");

        state.changeLanguage(["ÄPFEL", "KRÄNE"]);

        expect(state.getCorrectLetters()).toEqual(["", "", "", "", ""]);
        expect(state.getPresentLetters()).toEqual(["", "", "", "", ""]);
        expect(state.getPresentRules()).toEqual({});
        expect(state.isLetterValidForCorrect("T")).toBe(true);
    });

    it("resets all letter constraints when the word length changes", () => {
        const state = new WordleState(5, vi.fn(), vi.fn());

        state.setCorrectLetters(["C", "", "", "", ""]);
        state.setPresentLetters(["R", "", "", "", ""]);
        state.setPresentRule("R", 0, true);
        state.setAbsentLetters("T");

        state.changeWordLength(6, ["CASTLE"]);

        expect(state.getCorrectLetters()).toEqual(["", "", "", "", "", ""]);
        expect(state.getPresentLetters()).toEqual(["", "", "", "", "", ""]);
        expect(state.getPresentRules()).toEqual({});
        expect(state.isLetterValidForCorrect("T")).toBe(true);
    });

    it("updates the state word length when the word length changes", () => {
        const state = new WordleState(5, vi.fn(), vi.fn());

        state.changeWordLength(6, ["CASTLE"]);

        expect(state.letterCount).toBe(6);
    });
});
