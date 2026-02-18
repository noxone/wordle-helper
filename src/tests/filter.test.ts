import { describe, it, expect } from "vitest";
import { filterWords } from "../logic/filter";
import type {AppState} from "../state/store";

describe("filterWords", () => {
    it("filters correctly", () => {
        const state: AppState = {
            correct: ["a", "", "", "", ""],
            present: new Set(["r"]),
            absent: new Set(["t"]),
            presentRules: { r: new Set([1]) },
            wordList: ["arise", "raise", "crane", "apple"],
        };

        const result = filterWords(state);
        expect(result).toContain("arise");
        expect(result).not.toContain("crane");
    });
});
