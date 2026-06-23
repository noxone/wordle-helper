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
});
