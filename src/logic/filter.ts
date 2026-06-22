export type PresentRules = Record<string, Set<number>>;

export type FilterCriteria = {
    correct: string[];
    present: Set<string>;
    absent: Set<string>;
    presentRules: PresentRules;
    wordList: string[];
};

export function filterWords(criteria: FilterCriteria): string[] {
    return criteria.wordList.filter(word =>
        matchesCorrectLetters(word, criteria.correct)
        && containsPresentLetters(word, criteria.present, criteria.presentRules)
        && doesNotContainAbsent(word, criteria.absent)
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
