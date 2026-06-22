# WordleHelper — Specification

## Goal

Ship WordleHelper as a polished, publicly accessible web tool on GitHub Pages.  
The tool helps players of any Wordle variant filter candidate words based on letter constraints.

---

## Confirmed Intent

| | |
|---|---|
| **Outcome** | Published, multi-language Wordle helper on GitHub Pages |
| **Primary user** | Olaf himself + any public visitor |
| **Success** | Deployed, ≥80% test coverage, language auto-detection, variable word length |
| **Constraint** | Vanilla TypeScript + Vite — no framework change |
| **Out of scope** | Auto-solver, user accounts, backend, word-frequency ranking |

---

## Feature Specifications

---

### F-1 · Extract Filter Logic + Fix Tests

**Status:** Complete — verified June 22, 2026.

**Implemented:**

The filtering predicates are implemented in `src/logic/filter.ts` behind one standalone pure function:

```ts
export function filterWords(state: AppState): string[]
```

`AppState` and `PresentRules` are exported by `src/state/store.ts`:

```ts
type AppState = {
  correct: string[]          // green letters, '' = unknown
  present: Set<string>       // yellow letters
  absent: Set<string>        // grey letters
  presentRules: {
    [letter: string]: Set<number> // forbidden positions per letter
  }
  wordList: string[]
}
```

`WordleState` constructs this state and delegates to `filterWords`; it contains no duplicate filtering predicates.

During completion, `presentRules` was corrected to use the specified exclusion semantics: a configured position is forbidden for that present letter.

**Acceptance criteria:**
- [x] `npm test -- --run` passes with zero failures
- [x] Correct, present, absent, and forbidden-position constraints are preserved
- [x] `filterWords` is the single source of filtering truth
- [x] `WordleState` delegates filtering to `filterWords`

---

### F-2 · Test Coverage ≥ 80%

**What to do:**

Write unit tests in `src/tests/` covering:

- All three filter predicates independently (correct, present, absent)
- Edge cases: empty state filters nothing, all-absent yields empty list
- Interaction cases: correct + present conflict, same letter in correct + absent
- `presentRules` position exclusion logic
- Variable word length inputs (see F-4)

**Acceptance criteria:**
- Vitest coverage report shows ≥80% line/branch coverage for `src/logic/`
- All tests pass in CI (see F-6)

---

### F-3 · Language Selection

**What to do:**

Add a language selector to the UI (dropdown or button group). Available languages and their browser locale codes:

| Language | Locale | Source file |
|---|---|---|
| Deutsch | `de` | `data/dgwicks.net/deutsch.txt` |
| English | `en` | `data/en-5.txt` (already in public/) |
| Español | `es` | `data/dgwicks.net/espanol.txt` |
| Français | `fr` | `data/dgwicks.net/francais.txt` |
| Italiano | `it` | `data/dgwicks.net/italiano.txt` |
| Nederlands | `nl` | `data/dgwicks.net/nederlands3.txt` |
| Dansk | `da` | `data/dgwicks.net/dansk.txt` |
| Norsk | `no` | `data/dgwicks.net/norsk.txt` |

**Word list preparation (build-time script):**

A script `scripts/build-wordlists.ts` filters each source file by word length and writes the output to `public/{lang}/{length}.txt` (lowercase, one word per line, only ASCII-range letters).

Example output paths: `public/de/5.txt`, `public/fr/6.txt`, etc.

This script runs once manually or as part of the build. The generated files are committed to `public/` (they are served assets, not build artefacts).

**Auto-detection:**

On first load, read `navigator.language` (e.g. `"de-DE"` → `"de"`). If the detected language is in the supported list, use it. Otherwise fall back to `"en"`.

**Persistence:**

Store the selected language in `localStorage` so the choice survives page reloads.

**Acceptance criteria:**
- Dropdown shows all 8 languages
- Correct word list is loaded when language changes
- Auto-detection works for supported locales
- Selection is remembered across reloads
- Changing language resets all constraints and reloads the word list

---

### F-4 · Variable Word Length

**What to do:**

Add a word-length selector to the UI (e.g. buttons 4 / 5 / 6 / 7). The available lengths depend on what word lists exist for the current language.

`MAX_CHARACTERS` in `src/constants.ts` is currently a compile-time constant = 5.  
It must become a runtime value managed by `WordleState`.

The `LetterRow` component (and `PresentLetters`) must re-render when the length changes, as the number of input boxes is dynamic.

Word list URL pattern: `/public/{lang}/{length}.txt`

**Available lengths per language** (words with sufficient count, ≥500):

| Lang | 4 | 5 | 6 | 7 |
|---|---|---|---|---|
| de | ✓ | ✓ | ✓ | ✓ |
| en | — | ✓ | — | — |
| es | ✓ | ✓ | ✓ | ✓ |
| fr | ✓ | ✓ | ✓ | ✓ |
| it | ✓ | ✓ | ✓ | ✓ |
| nl | ✓ | ✓ | ✓ | ✓ |
| da | ✓ | ✓ | ✓ | — |
| no | ✓ | ✓ | ✓ | ✓ |

The UI only shows length buttons for lengths that exist for the current language.

**Persistence:** Store selected length in `localStorage`.

**Acceptance criteria:**
- Length selector shows only available lengths for the current language
- All input rows resize when length changes
- Changing length resets all constraints
- Filter logic works correctly for all lengths

---

### F-5 · UX Improvements

#### F-5a · Reset Button

Add a "Zurücksetzen" button that clears all constraints (correct, present, absent) and resets the UI to its initial state. Does not change the language or word length.

#### F-5b · Empty Results Feedback

When the filtered word list is empty, show a clear message instead of a blank list:
> *Keine Wörter gefunden. Bitte Eingaben prüfen.*

#### F-5c · Result Count Display

Always show the total number of matches. When more than 10 words match, show:
> *37 Wörter gefunden — die ersten 10 werden angezeigt.*

When ≤10 match, show:
> *3 Wörter gefunden.*

---

### F-6 · GitHub Actions CI/CD

**What to do:**

Create `.github/workflows/ci.yml`:
- Trigger: push and pull_request on `main`
- Steps: `npm ci` → `npm run build` → `npm test -- --coverage`
- Fail if coverage drops below 80%

Create `.github/workflows/deploy.yml`:
- Trigger: push to `main` (after CI passes)
- Deploy `dist/` to GitHub Pages using `actions/deploy-pages`

**Vite base URL:**

Set `base` in `vite.config.ts` (or `vite.config.js`, create if missing) to the GitHub Pages subdirectory path, e.g. `/WordleHelper/`.

**Acceptance criteria:**
- Every push to `main` runs tests automatically
- A passing build on `main` deploys to GitHub Pages
- The app loads correctly at the GitHub Pages URL

---

### F-7 · Repository Cleanup

- Remove `dist/` from git tracking (`git rm -r --cached dist/`) — it is already in `.gitignore`
- Verify `.gitignore` covers `dist/`, `node_modules/`, and generated coverage reports

---

## Implementation Order

| # | Feature | Depends on |
|---|---|---|
| 1 | F-1 Extract filter + fix tests | — |
| 2 | F-2 Test coverage ≥80% | F-1 |
| 3 | F-7 Repository cleanup | — |
| 4 | F-3 Language selection | F-1 |
| 5 | F-4 Variable word length | F-3 |
| 6 | F-5 UX improvements | F-4 |
| 7 | F-6 CI/CD + GitHub Pages | F-2, F-5 |

---

## Non-Goals (explicitly out of scope)

- Suggesting the optimal next guess automatically
- User accounts or saved game history
- Backend / server-side logic
- Word frequency ranking
- Mobile-native app (responsive web is sufficient)
