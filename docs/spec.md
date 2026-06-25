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
export function filterWords(criteria: FilterCriteria): string[]
```

`FilterCriteria` and `PresentRules` are exported by `src/logic/filter.ts`:

```ts
type FilterCriteria = {
  correct: string[]          // green letters, '' = unknown
  present: Set<string>       // yellow letters
  absent: Set<string>        // grey letters
  presentRules: {
    [letter: string]: Set<number> // forbidden positions per letter
  }
  wordList: string[]
}
```

`WordleState` constructs these criteria and delegates to `filterWords`; it contains no duplicate filtering predicates.

During completion, `presentRules` was corrected to use the specified exclusion semantics: a configured position is forbidden for that present letter.

**Acceptance criteria:**
- [x] `npm test -- --run` passes with zero failures
- [x] Correct, present, absent, and forbidden-position constraints are preserved
- [x] `filterWords` is the single source of filtering truth
- [x] `WordleState` delegates filtering to `filterWords`

---

### F-2 · Test Coverage ≥ 80%

**Status:** Complete — verified June 23, 2026.

**Implemented:**

Unit tests in `src/tests/filter.test.ts` cover:

- All three filter predicates independently (correct, present, absent)
- Edge cases: empty state filters nothing, all-absent yields empty list
- Interaction cases: correct + present conflict, same letter in correct + absent
- `presentRules` position exclusion logic
- Variable word length inputs (see F-4)

Vitest V8 coverage is configured for `src/logic/` with an enforced 80% minimum for lines and branches. The verification run on June 23, 2026 reported:

- Lines: 100%
- Branches: 100%
- Functions: 100%
- Statements: 100%

**Acceptance criteria:**
- [x] Vitest coverage report shows ≥80% line/branch coverage for `src/logic/`
- [x] All tests pass locally; CI integration follows in F-7

---

### F-3 · Language Selection

**Status:** Complete — verified June 24, 2026.

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

A script `scripts/build-wordlists.ts` filters each source file by word length and writes the output to `public/{lang}/{length}.txt` (uppercase, one word per line, letters only).

Word validation must be Unicode-aware. It must accept letters with accents, umlauts, cedillas, tildes, and similar diacritics, for example `ä`, `ö`, `ü`, `é`, `è`, `ç`, `ñ`, and `å`. It must not reduce them to ASCII equivalents during word-list preparation; for example `ä` must remain `ä`, not become `a`.

The script should reject entries containing digits, punctuation, whitespace inside the word, or symbols. Word length must be counted by user-visible characters, not raw UTF-16 code units, so precomposed and combining-accent forms are handled consistently.

Example output paths: `public/de/5.txt`, `public/fr/6.txt`, etc.

This script runs once manually or as part of the build. The generated files are committed to `public/` (they are served assets, not build artefacts).

Build integration: `npm run build:wordlists` runs `scripts/build-wordlists.ts`, and `npm run build` runs it automatically through the `prebuild` hook before TypeScript and Vite build the app.

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

**Status:** Complete — verified June 25, 2026.

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
| en | ✓ | ✓ | ✓ | ✓ |
| es | ✓ | ✓ | ✓ | ✓ |
| fr | ✓ | ✓ | ✓ | ✓ |
| it | ✓ | ✓ | ✓ | ✓ |
| nl | ✓ | ✓ | ✓ | ✓ |
| da | ✓ | ✓ | ✓ | ✓ |
| no | ✓ | ✓ | ✓ | ✓ |

The UI only shows length buttons for lengths that exist for the current language.

**Persistence:** Store selected length in `localStorage`.

**Acceptance criteria:**
- Length selector shows only available lengths for the current language
- All input rows resize when length changes
- Changing length resets all constraints
- Filter logic works correctly for all lengths
- Word lists are generated for word counts for each language in build phase

---

### F-5 · Application Test Coverage ≥ 80%

**Status:** Complete — verified June 25, 2026.

**What to do:**

Extend the test suite beyond the pure filter logic to cover application state, DOM components, and application wiring:

- Add a browser-like Vitest environment such as `jsdom`
- Test `WordleState` mutations, validation, resets, word-list loading, and update callbacks
- Test DOM components by rendering them into a test document and exercising their user interactions
- Add an application smoke test covering initialization and the connection between components and state
- Mock browser APIs and external boundaries such as `fetch`, `localStorage`, and `navigator.language`
- Report coverage for all application code under `src/`, not only `src/logic/`

Tests should assert observable behavior and avoid depending on internal implementation details.

**Acceptance criteria:**
- Vitest coverage report shows ≥80% line and branch coverage across `src/`
- `src/logic/`, `src/state/`, and `src/components/` are included in the enforced coverage threshold
- Application initialization is covered by at least one browser-environment smoke test
- Tests run deterministically without network access
- All tests pass in CI (see F-7)

---

### F-6 · UX Improvements

#### F-6a · Reset Button

Add a "Zurücksetzen" button that clears all constraints (correct, present, absent) and resets the UI to its initial state. Does not change the language or word length.

#### F-6b · Empty Results Feedback

When the filtered word list is empty, show a clear message instead of a blank list:
> *Keine Wörter gefunden. Bitte Eingaben prüfen.*

#### F-6c · Result Count Display

Always show the total number of matches. When more than 10 words match, show:
> *37 Wörter gefunden.*

When ≤10 match, show:
> *3 Wörter gefunden.*

#### F-6d · Scrollable Results List

The remaining-words list grows to fit up to 10 words. When 11 or more words match, cap the visible list height at 10 words and allow the user to scroll through all remaining words using the native scrollbar.

Do not add pagination, filtering, grouping, sorting, a "show more" interaction, or a separate overflow indicator.

---

### F-7 · GitHub Actions CI/CD

**Status:** Complete — verified June 25, 2026.

**What to do:**

Create `.github/workflows/ci.yml`:
- Trigger: push and pull_request on `main`
- Steps: `npm ci` → `npm run build` → `npm test -- --coverage`
- Fail if coverage drops below 80%

Create `.github/workflows/deploy.yml`:
- Trigger: push to `main` (after CI passes)
- Deploy `dist/` to GitHub Pages using `actions/deploy-pages`

**Vite base URL:**

No custom Vite `base` is required when publishing directly at `https://wordle.olafneumann.org/`.

**Acceptance criteria:**
- Every push to `main` runs tests automatically
- A passing build on `main` deploys to GitHub Pages
- The app loads correctly at the GitHub Pages URL

---

### F-8 · Repository Cleanup

**Status:** Complete — verified June 25, 2026.

- Remove `dist/` from git tracking (`git rm -r --cached dist/`) — it is already in `.gitignore`
- Verify `.gitignore` covers `dist/`, `node_modules/`, and generated coverage reports

---

### F-i18n · UI Internationalization

**Status:** Specified.

**Spec:** `docs/F-i18n/spec.md`

**What to do:**

Internationalize the user interface while keeping dictionary language and interface language separate:

- `wordLocale` controls the loaded word list and available word lengths
- `uiLocale` controls labels, headings, help text, placeholders, document title, and accessibility labels

Initial UI languages are German and English. The first implementation uses browser-detected UI language only, with no visible UI language selector. Unsupported browser UI locales fall back to English.

**Acceptance criteria:**
- All visible static UI copy can be rendered in German and English
- `wordLocale` and `uiLocale` have separate persistence and behavior
- Browser UI locale detection works for supported locales and falls back to English otherwise
- Dictionary language labels stay as self-names regardless of UI locale
- No visible UI language selector is added in the first implementation
- Changing UI language does not reload word lists or clear constraints
- Changing word-list language does not change UI language
- `npm test -- --run` passes
- `npm run build` passes

---

## Implementation Order

| # | Feature | Depends on |
|---|---|---|
| 1 | F-1 Extract filter + fix tests | — |
| 2 | F-2 Test coverage ≥80% | F-1 |
| 3 | F-8 Repository cleanup | — |
| 4 | F-3 Language selection | F-1 |
| 5 | F-4 Variable word length | F-3 |
| 6 | F-5 Application test coverage ≥80% | F-2, F-4 |
| 7 | F-6 UX improvements | F-4 |
| 8 | F-7 CI/CD + GitHub Pages | F-5, F-6 |
| 9 | F-i18n UI internationalization | F-4 |

---

## Non-Goals (explicitly out of scope)

- Suggesting the optimal next guess automatically
- User accounts or saved game history
- Backend / server-side logic
- Word frequency ranking
- Mobile-native app (responsive web is sufficient)
