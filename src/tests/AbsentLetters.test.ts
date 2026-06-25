// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createAbsentLetters } from "../components/AbsentLetters";
import { WordleState } from "../state/store";

describe("createAbsentLetters", () => {
    it("cleans absent input and removes known correct and present letters", () => {
        const input = document.createElement("input");
        const state = new WordleState(5, vi.fn(), vi.fn());
        state.setCorrectLetters(["C", "", "", "", ""]);
        state.setPresentLetters(["R", "", "", "", ""]);

        createAbsentLetters(input, /^\p{L}$/u, /[^\p{L}]/gu, state);

        input.value = "crane!!";
        input.dispatchEvent(new Event("input"));

        expect(input.value).toBe("ANE");
        expect(state.isLetterValidForCorrect("A")).toBe(false);
    });
});
