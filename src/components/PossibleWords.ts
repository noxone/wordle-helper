
export class PossibleWords {
    private static readonly maximumVisibleWordsBeforeScrolling = 10;
    private static readonly scrollableResultsListClassNames = ["max-h-80", "overflow-y-auto"];

    private readonly resultsListElement: HTMLElement;
    private readonly countElement: HTMLElement;

    constructor(resultsListElement: HTMLElement, countElement: HTMLElement) {
        this.resultsListElement = resultsListElement;
        this.countElement = countElement;
    }

    public showPossibleWords(words: string[]) {
        this.countElement.textContent = words.length === 1
            ? "1 Wort gefunden."
            : `${words.length} Wörter gefunden.`;

        this.resetResultsListLayout();
        if (this.needsScrollableResultsList(words)) {
            this.resultsListElement.classList.add(...PossibleWords.scrollableResultsListClassNames);
        }
        this.resultsListElement.innerHTML = "";
        if (words.length === 0) {
            this.appendResultItem("Keine Wörter gefunden. Bitte Eingaben prüfen.");
            return;
        }

        words.forEach((word) => {
            this.appendResultItem(word);
        });
    }

    private needsScrollableResultsList(words: string[]): boolean {
        return words.length > PossibleWords.maximumVisibleWordsBeforeScrolling;
    }

    private resetResultsListLayout(): void {
        this.resultsListElement.classList.remove(...PossibleWords.scrollableResultsListClassNames);
    }

    private appendResultItem(text: string): void {
        const li = document.createElement("li");
        li.textContent = text;
        this.resultsListElement.appendChild(li);
    }
}
