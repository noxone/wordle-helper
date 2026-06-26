// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createLetterRow } from "../components/LetterRow";

function press(input: HTMLInputElement, key: string, shiftKey = false): void {
    input.dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey }));
}

describe("createLetterRow", () => {
    it("rejects non-positive letter counts", () => {
        expect(() => createLetterRow(document.createElement("div"), 0, /^\p{L}$/u, true, "", "", () => true, vi.fn()))
            .toThrow("Letter count must be greater than 0");
    });

    it("enters valid letters and reports changed row values", () => {
        const container = document.createElement("div");
        const onChange = vi.fn();

        createLetterRow(container, 2, /^\p{L}$/u, true, "", "", () => true, onChange);
        const inputs = Array.from(container.querySelectorAll("input"));

        press(inputs[0], "c");

        expect(inputs[0].value).toBe("C");
        expect(onChange).toHaveBeenLastCalledWith(["C", ""]);
    });


    it("normalizes umlauts entered from key presses", () => {
        const container = document.createElement("div");
        const onChange = vi.fn();

        createLetterRow(container, 2, /^\p{L}$/u, true, "", "", () => true, onChange);
        const inputs = Array.from(container.querySelectorAll("input"));

        press(inputs[0], "ä");

        expect(inputs[0].value).toBe("Ä");
        expect(onChange).toHaveBeenLastCalledWith(["Ä", ""]);
    });

    it("normalizes umlauts entered from input events", () => {
        const container = document.createElement("div");
        const onChange = vi.fn();

        createLetterRow(container, 2, /^\p{L}$/u, true, "", "", () => true, onChange);
        const inputs = Array.from(container.querySelectorAll("input"));

        inputs[0].value = "a\u0308";
        inputs[0].dispatchEvent(new Event("input", { bubbles: true }));

        expect(inputs[0].value).toBe("Ä");
        expect(onChange).toHaveBeenLastCalledWith(["Ä", ""]);
    });

    it("does not enter invalid letters", () => {
        const container = document.createElement("div");
        const onChange = vi.fn();

        createLetterRow(container, 1, /^\p{L}$/u, true, "", "", () => false, onChange);
        const input = container.querySelector("input")!;

        press(input, "c");

        expect(input.value).toBe("");
        expect(onChange).not.toHaveBeenCalled();
    });

    it("prevents duplicates when duplicates are not allowed", () => {
        const container = document.createElement("div");
        const onChange = vi.fn();

        createLetterRow(container, 2, /^\p{L}$/u, false, "", "", () => true, onChange);
        const inputs = Array.from(container.querySelectorAll("input"));

        press(inputs[0], "c");
        press(inputs[1], "c");

        expect(inputs.map((input) => input.value)).toEqual(["C", ""]);
    });

    it("clears values with backspace and whitespace", () => {
        const container = document.createElement("div");
        const onChange = vi.fn();

        createLetterRow(container, 2, /^\p{L}$/u, true, "", "", () => true, onChange);
        const inputs = Array.from(container.querySelectorAll("input"));

        press(inputs[0], "c");
        press(inputs[0], "Backspace");
        press(inputs[1], "d");
        press(inputs[1], " ");

        expect(inputs.map((input) => input.value)).toEqual(["", ""]);
    });


    it("clears the focused value with delete", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const onChange = vi.fn();

        createLetterRow(container, 2, /^\p{L}$/u, true, "", "", () => true, onChange);
        const inputs = Array.from(container.querySelectorAll("input"));

        press(inputs[0], "c");
        press(inputs[1], "d");
        inputs[0].focus();
        press(inputs[0], "Delete");

        expect(inputs.map((input) => input.value)).toEqual(["", "D"]);
        expect(document.activeElement).toBe(inputs[0]);
        expect(onChange).toHaveBeenLastCalledWith(["", "D"]);
    });

    it("supports focus, highlight, and clear helpers", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const row = createLetterRow(container, 2, /^\p{L}$/u, true, "", "", () => true, vi.fn());
        const inputs = Array.from(container.querySelectorAll("input"));

        press(inputs[0], "c");
        row.focus("C");
        row.highlight(0);
        row.clear();

        expect(document.activeElement).toBe(inputs[0]);
        expect(inputs[0].classList.contains("animate-bounce")).toBe(true);
        expect(inputs.map((input) => input.value)).toEqual(["", ""]);
    });
});
