// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createWordLengthSelector } from "../components/WordLengthSelector";

describe("createWordLengthSelector", () => {
    it("renders a word-length selector with only lengths available for the selected language", () => {
        const select = document.createElement("select");

        createWordLengthSelector(select, [4, 5, 6, 7], 6, vi.fn());

        expect(Array.from(select.options).map((option) => [option.value, option.textContent])).toEqual([
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
        ]);
        expect(select.value).toBe("6");
    });
});
