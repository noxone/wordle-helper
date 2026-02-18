import "./style.css";
import { state } from "./state/store";
import { filterWords } from "./logic/filter";
import { createLetterRow } from "./components/LetterRow";
import { renderPresentConfig } from "./components/PresentLetterConfig";

const correctRow = document.getElementById("correct-row")!;
const presentRow = document.getElementById("present-row")!;
const absentInput = document.getElementById("absent") as HTMLInputElement;
const resultsEl = document.getElementById("results")!;
const countEl = document.getElementById("count")!;
const presentConfig = document.getElementById("present-config")!;

function update() {
    const matches = filterWords(state);

    countEl.textContent = String(matches.length);
    resultsEl.innerHTML = "";

    matches.slice(0, 10).forEach((w) => {
        const li = document.createElement("li");
        li.textContent = w;
        resultsEl.appendChild(li);
    });
}

createLetterRow(correctRow, (letters) => {
    state.correct = letters;
    update();
});

createLetterRow(presentRow, (letters) => {
    state.present = new Set(letters.filter(Boolean));
    renderPresentConfig(presentConfig, update);
    update();
});

absentInput.addEventListener("input", () => {
    const clean = absentInput.value
        .toLowerCase()
        .replace(/[^a-z]/g, "");
    absentInput.value = clean;
    state.absent = new Set(clean.split(""));
    update();
});

// Wortliste laden
fetch("/en/5.txt")
    .then((r) => r.text())
    .then((text) => {
        state.wordList = text
            .split("\n")
            .map((w) => w.trim().toLowerCase())
            .filter((w) => w.length === 5);
        update();
    });
