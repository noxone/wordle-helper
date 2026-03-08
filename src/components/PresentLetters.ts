import {WordleState} from "../state/store";

export function renderPresentConfig(
    container: HTMLElement,
    wordleState: WordleState,
) {
    container.innerHTML = "";

    wordleState.getPresentLetters()
        .filter((letter) => { return letter !== ''})
        .forEach(letter => {
            const row = document.createElement("div");
            row.className = "flex items-center gap-2";

            const label = document.createElement("span");
            label.textContent = letter;
            label.className = "font-bold w-6";

            row.appendChild(label);

            const presentRules = wordleState.getPresentRules()
            for (let index = 0; index < wordleState.letterCount; index++) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = presentRules[letter] !== undefined && presentRules[letter].has(index);

                checkbox.addEventListener("change", () => {
                    wordleState.setPresentRule(letter, index, checkbox.checked);
                });

                row.appendChild(checkbox);
            }

            container.appendChild(row);
        })
}
