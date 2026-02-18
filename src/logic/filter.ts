import type {AppState} from "../state/store";

export function filterWords(state: AppState): string[] {
    return state.wordList.filter((word) => {
        // correct
        for (let i = 0; i < 5; i++) {
            const c = state.correct[i];
            if (c && word[i] !== c) return false;
        }

        // absent
        for (const a of state.absent) {
            if (word.includes(a)) return false;
        }

        // present
        for (const p of state.present) {
            if (!word.includes(p)) return false;

            const rules = state.presentRules[p];
            if (rules) {
                for (const pos of rules) {
                    if (word[pos] === p) return false;
                }
            }
        }

        return true;
    });
}
