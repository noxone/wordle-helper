export function createLetterRow(
    container: HTMLElement,
    letterCount: number,
    allowedCharacters: RegExp,
    color: string,
    colorFocus: string,
    onChange: (letters: string[]) => void
) {
    if (letterCount <= 0) {
        throw new Error("Letter count must be greater than 0");
    }

    const inputs: HTMLInputElement[] = [];

    function fireOnChange() {
        const letters = inputs.map((i) => i.value)
        onChange(letters);
    }


    for (let i = 0; i < letterCount; ++i) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.value = "";
        input.autocomplete = "off"
        input.pattern = allowedCharacters.source
        input.className =
            `w-12 h-12 text-center text-xl border rounded-lg caret-transparent ${color} ${colorFocus} transition-colors duration-500 outline-none`;

        input.addEventListener("keydown", (e) => {
            const key = e.key;
            const upperKey = key.toUpperCase();

            if (key === "ArrowRight") {
                selectNext()
            }
            if (key === "ArrowLeft") {
                selectPrevious()
            }

            if (key === "Tab") {
                if (e.shiftKey) {
                    selectPrevious()
                } else {
                    selectNext()
                }
            }

            if (key === "Backspace") {
                if (hasValue()) {
                    setValue("")
                } else {
                    selectPrevious()
                    setValue("", -1)
                }
                fireOnChange()
            }

            if (allowedCharacters.test(upperKey)) {
                setValue(upperKey)
                selectNext()
                fireOnChange()
            }

            if (/\s/.test(key)) {
                setValue("")
                fireOnChange()
            }

            e.preventDefault()
        });
        function hasValue(): boolean {
            return inputs[i].value.length > 0
        }
        function setValue(value: string, relativeIndex: number = 0) {
            inputs[i + relativeIndex].value = value;
        }
        function selectNext() {
            select(i + 1)
        }
        function selectPrevious() {
            select(i - 1)
        }
        function select(index: number) {
            const safeIndex = Math.min(letterCount - 1, Math.max(0, index))
            inputs[safeIndex].focus();
        }

        inputs.push(input);
        container.appendChild(input);
    }

    return inputs;
}
