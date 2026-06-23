# Test List: F-3 Language Selection

## Current Focus

- None.

## Pending Tests

- None.

## Refactoring / Design Ideas

- Keep word-list preparation logic separate from DOM/browser state so it can be tested in Node.
- Use small fixture word lists for generator tests instead of the full source dictionaries.
- Normalize Unicode consistently before validating and measuring word length.
- Keep language metadata in one place so UI options, auto-detection, and loading paths cannot drift.
- Mock `fetch`, `navigator.language`, and `localStorage` in application-level tests.

## Completed Tests

- [x] builds a lowercase word list for one language and one word length
- [x] excludes words that do not match the requested word length
- [x] keeps Unicode letters with accents and umlauts unchanged
- [x] rejects words containing digits, punctuation, whitespace, or symbols
- [x] writes generated word lists to `public/{lang}/{length}.txt`
- [x] exposes all supported languages with their locale codes and labels
- [x] loads the English word list by default
- [x] loads the selected language word list when the language changes
- [x] detects a supported browser locale on first load
- [x] falls back to English for an unsupported browser locale
- [x] stores the selected language in local storage
- [x] restores the stored language on reload
- [x] resets all letter constraints when the language changes
