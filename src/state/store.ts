export type PresentRules = {
    [letter: string]: Set<number>;
};

export class WordleState {
    readonly letterCount: number;
    private wordList: string[] = [];
    private correctLetters: string[] = []
    private presentLetters: string[] = []
    private presentRules: PresentRules = {}
    private absentLetters: string = ""
    private readonly onUpdate: (words: string[]) => void
    private readonly onPresentLetterUpdate: (state: WordleState) => void

    constructor(
        letterCount: number,
        onUpdate: (words: string[]) => void,
        onPresentLetterUpdate: (state: WordleState) => void,
    ) {
        this.letterCount = letterCount;
        this.onUpdate = onUpdate;
        this.onPresentLetterUpdate = onPresentLetterUpdate;
        for (let i = 0; i < letterCount; i++) {
            this.correctLetters.push("")
            this.presentLetters.push("")
        }
    }

    public isLetterValidForCorrect(letter: string): boolean {
        return !this.absentLetters.includes(letter)
    }

    public isLetterValidForPresent(letter: string): boolean {
        return !this.absentLetters.includes(letter) && !this.presentLetters.includes(letter)
    }

    private update() {
        const possibleWords = this.wordList
            .filter(this.wordMatchesCorrectLetters)
            .filter(this.wordContainsPresentLetters)
            .filter(this.wordDoesNotContainAbsentLetters)
        this.onUpdate(possibleWords);
    }

    public setCorrectLetters(letters: string[]) {
        this.correctLetters = letters;
        this.update()
    }

    public getCorrectLetters(): string[] {
        return this.correctLetters;
    }

    public setPresentLetters(letters: string[]) {
        this.presentLetters = letters;
        this.onPresentLetterUpdate(this);
        this.update()
    }

    public getPresentLetters(): string[] {
        return [...this.presentLetters];
    }

    public getPresentRules() {
        return this.presentRules;
    }

    public setPresentRule(letter: string, index: number, checked: boolean) {
        if (this.presentRules[letter] === undefined) {
            this.presentRules[letter] = new Set()
        }
        if (checked) {
            this.presentRules[letter].add(index)
        } else {
            this.presentRules[letter].delete(index)
        }
        this.update()
    }

    public setAbsentLetters(letters: string) {
        this.absentLetters = letters.toUpperCase();
        this.update()
    }

    private wordMatchesCorrectLetters = (word: string) => {
        return this.correctLetters
            .map((value, index) => {
                return value === "" || word.at(index) === value
            })
            .reduce((acc, cur) => {return acc && cur}, true)
    }

    private wordContainsPresentLetters = (word: string) => {
        return this.presentLetters
            .filter((letter: string) => {return letter.length > 0})
            .map((letter: string) => {return word.includes(letter) && this.wordFitsToPresentRule(word, letter)})
            .reduce((acc, cur) => {return acc && cur}, true)
    }

    private wordFitsToPresentRule = (word: string, letter: string) => {
        if (this.presentRules[letter] === undefined) {
            return true;
        }
        return Array.from(this.presentRules[letter].values())
            .map((value: number) => {
                return word.at(value) === letter
            })
            .reduce((acc, cur) => {return acc && cur}, true)
    }

    private wordDoesNotContainAbsentLetters = (word: string) => {
        const contains = this.absentLetters
            .split('')
            .map((letter: string) => {return word.includes(letter)})
            .reduce((acc, cur) => {return acc || cur}, false)
        return !contains;
    }

    private setWordList(wordList: string[]) {
        this.wordList = wordList;
        this.update();
    }

    public loadWordList(uri: string): void {
        // Wortliste laden
        fetch(uri)
            .then((r) => r.text())
            .then((text) => {
                    const wordList = text
                        .split("\n")
                        .map((word) => word.trim().toUpperCase())
                        .filter((word) => word.length === this.letterCount);
                    this.setWordList(wordList);
                });
    }

}
