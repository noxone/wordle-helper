// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { renderPresentConfig } from "../components/PresentLetters";
import { WordleState } from "../state/store";

describe("renderPresentConfig", () => {
    it("renders one checkbox per word position for present letters", () => {
        const container = document.createElement("div");
        const state = new WordleState(5, vi.fn(), vi.fn());
        state.setPresentLetters(["R", "", "", "", ""]);

        renderPresentConfig(container, state);

        expect(container.querySelector("span")?.textContent).toBe("R");
        expect(container.querySelectorAll("input[type='checkbox']")).toHaveLength(5);
    });

    it("renders checked forbidden-position rules and updates them on change", () => {
        const container = document.createElement("div");
        const state = new WordleState(5, vi.fn(), vi.fn());
        state.setPresentLetters(["R", "", "", "", ""]);
        state.setPresentRule("R", 1, true);

        renderPresentConfig(container, state);
        const checkboxes = Array.from(container.querySelectorAll<HTMLInputElement>("input[type='checkbox']"));

        expect(checkboxes[1].checked).toBe(true);

        checkboxes[2].checked = true;
        checkboxes[2].dispatchEvent(new Event("change"));

        expect(state.getPresentRules()["R"].has(2)).toBe(true);
    });

    it("clears stale rendered present-letter controls", () => {
        const container = document.createElement("div");
        const state = new WordleState(5, vi.fn(), vi.fn());
        container.innerHTML = "<span>old</span>";

        renderPresentConfig(container, state);

        expect(container.innerHTML).toBe("");
    });
});
