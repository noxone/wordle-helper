import { filterWords } from "../logic/filter";
import type { FilterCriteria, PresentRules } from "../logic/filter";

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
        this.correctLetters = this.emptyLetters();
        this.presentLetters = this.emptyLetters();
    }

    public isLetterValidForCorrect(letter: string): boolean {
        return !this.absentLetters.includes(letter)
    }

    public isLetterValidForPresent(letter: string): boolean {
        return !this.absentLetters.includes(letter) && !this.presentLetters.includes(letter)
    }

    private emptyLetters(): string[] {
        return Array(this.letterCount).fill("");
    }

    private update() {
        const criteria: FilterCriteria = {
            correct: this.correctLetters,
            present: new Set(this.presentLetters.filter(l => l !== '')),
            absent: new Set(this.absentLetters.split('').filter(l => l !== '')),
            presentRules: this.presentRules,
            wordList: this.wordList,
        };
        this.onUpdate(filterWords(criteria));
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

    private setWordList(wordList: string[]) {
        this.wordList = wordList;
        this.update();
    }

    public changeLanguage(wordList: string[]): void {
        this.wordList = wordList;
        this.correctLetters = this.emptyLetters();
        this.presentLetters = this.emptyLetters();
        this.presentRules = {};
        this.absentLetters = "";
        this.onPresentLetterUpdate(this);
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
