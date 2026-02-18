import { state } from "../state/store";

export function renderPresentConfig(
    container: HTMLElement,
    onChange: () => void
) {
    container.innerHTML = "";

    state.present.forEach((letter) => {
        if (!state.presentRules[letter]) {
            state.presentRules[letter] = new Set();
        }

        const row = document.createElement("div");
        row.className = "flex items-center gap-2";

        const label = document.createElement("span");
        label.textContent = letter;
        label.className = "font-bold w-6";

        row.appendChild(label);

        for (let i = 0; i < 5; i++) {
            const cb = document.createElement("input");
            cb.type = "checkbox";

            if (state.presentRules[letter].has(i)) {
                cb.checked = true;
            }

            cb.addEventListener("change", () => {
                if (cb.checked) {
                    state.presentRules[letter].add(i);
                } else {
                    state.presentRules[letter].delete(i);
                }
                onChange();
            });

            row.appendChild(cb);
        }

        container.appendChild(row);
    });
}
