export type PresentRules = {
    [letter: string]: Set<number>;
};

export type AppState = {
    correct: string[];
    present: Set<string>;
    absent: Set<string>;
    presentRules: PresentRules;
    wordList: string[];
};

export const state: AppState = {
    correct: ["", "", "", "", ""],
    present: new Set(),
    absent: new Set(),
    presentRules: {},
    wordList: [],
};
