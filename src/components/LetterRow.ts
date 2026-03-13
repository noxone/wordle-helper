
export class LetterRow {
    private readonly inputs: HTMLInputElement[];

    constructor(inputs: HTMLInputElement[]) {
        this.inputs = inputs;
    }

    public focus(index: number | string) {
        this.getItem(index).focus();
    }

    public highlight(index: number | string) {
        const highlightClass = 'animate-bounce'
        const item = this.getItem(index);
        item.classList.add(highlightClass);
        setTimeout(() => { item.classList.remove(highlightClass) }, 1000)
    }

    private getItem(index: number | string) {
        if (typeof index === 'number') {
            return this.inputs[index]
        } else if (typeof index === 'string') {
            return this.inputs.filter(input => { return input.value === index })[0];
        } else {
            throw new Error(`Unknown item ${index}`);
        }
    }
}

export function createLetterRow(
    container: HTMLElement,
    letterCount: number,
    allowedCharacters: RegExp,
    allowDuplicates: boolean,
    color: string,
    colorFocus: string,
    isLetterValid: (letter: string) => boolean,
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
                if (allowDuplicates || !doesValueExist(upperKey)) {
                    setValue(upperKey)
                    selectNext()
                    fireOnChange()
                }
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
        function doesValueExist(letter: string) {
            for (let i = 0; i < letterCount; ++i) {
                if (inputs[i].value === letter) {
                    return true;
                }
            }
            return false;
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

    return new LetterRow(inputs);
}
