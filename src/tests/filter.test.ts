import { describe, it, expect } from "vitest";
import { filterWords } from "../logic/filter";
import type {AppState} from "../state/store";

describe("filterWords", () => {
    it("filters correctly", () => {
        const state: AppState = {
            correct: ["a", "", "", "", ""],
            present: new Set(["r"]),
            absent: new Set(["t"]),
            presentRules: { r: new Set([0]) },
            wordList: ["arise", "raise", "crane", "apple"],
        };

        const result = filterWords(state);
        expect(result).toContain("arise");
        expect(result).not.toContain("crane");
    });

    it("excludes a word when a present letter appears at a forbidden position", () => {
        const state: AppState = {
            correct: ["", "", "", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: { R: new Set([1]) },
            wordList: ["ARISE", "RAISE"],
        };

        expect(filterWords(state)).toEqual(["RAISE"]);
    });
});
