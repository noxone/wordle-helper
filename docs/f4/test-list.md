# Test List: F-4 Variable Word Length

## Current Focus

- None.

## Pending Tests

- None.

## Refactoring / Design Ideas

- Keep language-to-length availability metadata in one place so UI options and loading paths cannot drift.
- Move fixed word length out of `MAX_CHARACTERS` and into `WordleState`.
- Keep word-list loading parameterized by locale and length.
- Keep browser wiring thin by using small component functions for length selector rendering and reset behavior.
- Mock `fetch`, `localStorage`, and DOM reset behavior in application-level tests.

## Completed Tests

- [x] clears visible constraint inputs when the selector changes
- [x] re-renders present-letter inputs to match the selected word length
- [x] re-renders correct-letter inputs to match the selected word length
- [x] resets the state constraints when the selector changes
- [x] loads the selected word list when the selector changes
- [x] stores the selected word length when the selector changes
- [x] loads the selected word list on startup
- [x] selects the restored word length on startup
- [x] renders a word-length selector with only lengths available for the selected language
- [x] updates the state word length when the word length changes
- [x] resets all letter constraints when the word length changes
- [x] generates word lists for all configured word lengths for each supported language during the build phase
- [x] falls back to an available length when the stored length is not available for the current language
- [x] restores the stored word length on reload when it is available for the current language
- [x] stores the selected word length in local storage
- [x] loads the default available length when no stored length exists
- [x] loads the selected length word list for the current language
- [x] exposes available word lengths per supported language
