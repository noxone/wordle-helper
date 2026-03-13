
export class PossibleWords {
    private readonly resultElement: HTMLElement;
    private readonly counterElement: HTMLElement;

    constructor(resultElement: HTMLElement, counterElement: HTMLElement) {
        this.resultElement = resultElement;
        this.counterElement = counterElement;
    }

    public showPossibleWords(words: string[]) {
        this.counterElement.textContent = String(words.length);

        this.resultElement.innerHTML = "";
        words.slice(0, 10).forEach((word) => {
            const li = document.createElement("li");
            li.textContent = word;
            this.resultElement.appendChild(li);
        });
    }
}
