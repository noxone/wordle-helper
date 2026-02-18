export function createLetterRow(
    container: HTMLElement,
    onChange: (letters: string[]) => void
) {
    const inputs: HTMLInputElement[] = [];

    function emit() {
        onChange(inputs.map((i) => i.value));
    }

    for (let i = 0; i < 5; i++) {
        const input = document.createElement("input");
        input.maxLength = 1;
        input.className =
            "w-12 h-12 text-center text-xl border rounded-lg";

        input.addEventListener("keydown", (e) => {
            const key = e.key;

            if (key === "ArrowRight" && i < 4) {
                inputs[i + 1].focus();
                e.preventDefault();
            }

            if (key === "ArrowLeft" && i > 0) {
                inputs[i - 1].focus();
                e.preventDefault();
            }

            if (key === "Backspace" && !input.value && i > 0) {
                inputs[i - 1].focus();
            }
        });

        input.addEventListener("input", () => {
            let v = input.value.toLowerCase();

            if (v === " ") {
                input.value = "";
                if (i < 4) inputs[i + 1].focus();
                return;
            }

            if (!/^[a-z]$/.test(v)) {
                input.value = "";
                return;
            }

            input.value = v;

            if (i < 4) inputs[i + 1].focus();
            emit();
        });

        inputs.push(input);
        container.appendChild(input);
    }

    return inputs;
}
