# WordleHelper

A vanilla TypeScript + Vite web app that helps solve Wordle puzzles by filtering a word list against user-supplied letter constraints.

## Commands

```bash
npm run dev       # Vite dev server with HMR (default port 5173)
npm run build     # tsc --noEmit && vite build
npm run preview   # Preview the production build locally
npm test          # Vitest unit tests
```

## Architecture

**No framework.** The app is plain TypeScript DOM manipulation with Tailwind CSS for styling.

### Data flow

1. User types constraints into UI components
2. Components call back into `WordleState` (in `src/state/store.ts`)
3. `WordleState` re-runs the filter against the loaded word list
4. `WordleState` calls registered callbacks with filtered results
5. `PossibleWords` component re-renders the result list

### Key files

| File | Role |
|---|---|
| `src/main.ts` | Entry point — initializes `WordleState`, mounts all components, wires callbacks |
| `src/state/store.ts` | `WordleState` class — owns all constraint state and the word filter logic |
| `src/components/LetterRow.ts` | Reusable 5-box letter input; handles arrow-key / backspace navigation |
| `src/components/PresentLetters.ts` | Yellow-tile UI — letter + checkboxes for forbidden positions |
| `src/components/AbsentLetters.ts` | Grey-tile UI — single text input for absent letters |
| `src/components/PossibleWords.ts` | Renders up to 10 matching words plus total count |
| `src/constants.ts` | `WORD_LIST_URI`, `MAX_CHARACTERS` (5), input validation regexes |
| `public/en/5.txt` | English 5-letter word list fetched at runtime (~2 700 words) |

### Filtering logic (`WordleState`)

Three predicates applied in sequence:

- `wordMatchesCorrectLetters()` — each known green letter must be at the exact position
- `wordContainsPresentLetters()` — each yellow letter must appear somewhere, and *not* at any position the user marked as forbidden
- `wordDoesNotContainAbsentLetters()` — no grey letter may appear anywhere in the word

### Constraints stored in `WordleState`

| Property | Type | Description |
|---|---|---|
| `correctLetters` | `string[]` (length 5) | Green tiles; empty string = unknown |
| `presentLetters` | `string[]` | Letters known to be in the word (yellow) |
| `presentLetterRules` | `Map<string, number[]>` | Per-letter forbidden position indices |
| `absentLetters` | `string[]` | Letters confirmed absent (grey) |

## Known incomplete area

`src/tests/filter.test.ts` imports `filterWords` from `../logic/filter`, which does not exist yet. The test defines an `AppState` type and expects a standalone, testable `filterWords(state)` function. The filtering logic to extract lives in `WordleState` in `src/state/store.ts`.

## UI language

The interface labels are in **German** (`Korrekte Positionen`, `Buchstaben vorhanden`, `Buchstaben nicht vorhanden`). Keep new UI strings in German unless changing the language intentionally.

## Data directory

`data/` contains raw word lists (German, English, and other languages) used to build `public/en/5.txt`. These files are not served by the app and are excluded from the build via `.gitignore`'s dist exclusions — changes here don't affect the running app.

## TypeScript config

Strict mode is on (`strict: true`). Target is `ES2022`, module resolution is `bundler`. There is no `outDir`; Vite handles transpilation — `tsc` is only used for type-checking (`noEmit: true`).
