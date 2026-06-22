import { describe, it, expect } from "vitest";
import { filterWords } from "../logic/filter";
import type { FilterCriteria } from "../logic/filter";

describe("filterWords", () => {
    it("returns every word when no constraints are configured", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(),
            absent: new Set(),
            presentRules: {},
            wordList: ["ARISE", "CRANE", "APPLE"],
        };

        expect(filterWords(criteria)).toEqual(criteria.wordList);
    });

    it("keeps a word that matches a correct letter at its configured position", () => {
        const criteria: FilterCriteria = {
            correct: ["", "R", "", "", ""],
            present: new Set(),
            absent: new Set(),
            presentRules: {},
            wordList: ["ARISE", "CRANE"],
        };

        expect(filterWords(criteria)).toContain("ARISE");
    });

    it("excludes a word that does not match a correct letter at its configured position", () => {
        const criteria: FilterCriteria = {
            correct: ["", "R", "", "", ""],
            present: new Set(),
            absent: new Set(),
            presentRules: {},
            wordList: ["ARISE", "RAISE"],
        };

        expect(filterWords(criteria)).toEqual(["ARISE"]);
    });

    it("keeps a word that contains a present letter", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: {},
            wordList: ["ARISE", "APPLE"],
        };

        expect(filterWords(criteria)).toContain("ARISE");
    });

    it("excludes a word that does not contain a present letter", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: {},
            wordList: ["ARISE", "APPLE"],
        };

        expect(filterWords(criteria)).toEqual(["ARISE"]);
    });

    it("keeps a word that does not contain an absent letter", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(),
            absent: new Set(["T"]),
            presentRules: {},
            wordList: ["ARISE", "STARE"],
        };

        expect(filterWords(criteria)).toContain("ARISE");
    });

    it("excludes a word that contains an absent letter", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(),
            absent: new Set(["T"]),
            presentRules: {},
            wordList: ["ARISE", "STARE"],
        };

        expect(filterWords(criteria)).toEqual(["ARISE"]);
    });

    it("returns no words when absent letters eliminate every candidate", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(),
            absent: new Set(["T", "P"]),
            presentRules: {},
            wordList: ["STARE", "APPLE"],
        };

        expect(filterWords(criteria)).toEqual([]);
    });

    it("allows a present letter at any position when it has no position rule", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: {},
            wordList: ["ARISE", "CRANE"],
        };

        expect(filterWords(criteria)).toEqual(["ARISE", "CRANE"]);
    });

    it("allows a present letter outside all of its forbidden positions", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: { R: new Set([0, 1]) },
            wordList: ["STARE"],
        };

        expect(filterWords(criteria)).toEqual(["STARE"]);
    });

    it("excludes a present letter from each of its forbidden positions", () => {
        const criteria: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: { R: new Set([0, 1]) },
            wordList: ["RAISE", "ARISE", "STARE"],
        };

        expect(filterWords(criteria)).toEqual(["STARE"]);
    });

    it("returns no words when correct and present constraints conflict", () => {
        const criteria: FilterCriteria = {
            correct: ["R", "", "", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: { R: new Set([0]) },
            wordList: ["RAISE"],
        };

        expect(filterWords(criteria)).toEqual([]);
    });

    it("returns no words when the same letter is both correct and absent", () => {
        const criteria: FilterCriteria = {
            correct: ["R", "", "", "", ""],
            present: new Set(),
            absent: new Set(["R"]),
            presentRules: {},
            wordList: ["RAISE"],
        };

        expect(filterWords(criteria)).toEqual([]);
    });

    it("filters words with fewer than five letters", () => {
        const criteria: FilterCriteria = {
            correct: ["", "A", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: {},
            wordList: ["CARD", "ROAD"],
        };

        expect(filterWords(criteria)).toEqual(["CARD"]);
    });

    it("filters words with more than five letters", () => {
        const criteria: FilterCriteria = {
            correct: ["", "R", "", "", "", ""],
            present: new Set(["S"]),
            absent: new Set(),
            presentRules: {},
            wordList: ["CRANES", "RAISED"],
        };

        expect(filterWords(criteria)).toEqual(["CRANES"]);
    });

    it("filters correctly", () => {
        const state: FilterCriteria = {
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
        const state: FilterCriteria = {
            correct: ["", "", "", "", ""],
            present: new Set(["R"]),
            absent: new Set(),
            presentRules: { R: new Set([1]) },
            wordList: ["ARISE", "RAISE"],
        };

        expect(filterWords(state)).toEqual(["RAISE"]);
    });
});
