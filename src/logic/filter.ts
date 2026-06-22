import type { AppState, PresentRules } from "../state/store";

export function filterWords(state: AppState): string[] {
    return state.wordList.filter(word =>
        matchesCorrectLetters(word, state.correct)
        && containsPresentLetters(word, state.present, state.presentRules)
        && doesNotContainAbsent(word, state.absent)
    );
}

function matchesCorrectLetters(word: string, correct: string[]): boolean {
    return correct.every((letter, index) => letter === '' || word.at(index) === letter);
}

function containsPresentLetters(word: string, present: Set<string>, rules: PresentRules): boolean {
    return [...present].every(letter =>
        word.includes(letter) && avoidsForbiddenPositions(word, letter, rules[letter])
    );
}

function avoidsForbiddenPositions(word: string, letter: string, rule: Set<number> | undefined): boolean {
    if (!rule || rule.size === 0) return true;
    return [...rule].every(pos => word.at(pos) !== letter);
}

function doesNotContainAbsent(word: string, absent: Set<string>): boolean {
    return ![...absent].some(letter => word.includes(letter));
}
