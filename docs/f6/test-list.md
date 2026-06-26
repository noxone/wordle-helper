# Test List: F-6 UX Improvements

## Current Focus

- None.

## Pending Tests

- None.

## Refactoring / Design Ideas

- Keep reset behavior centralized in `WordleState` so UI components do not clear constraints independently.
- Keep result count and empty-results rendering near the possible-words component.
- Prefer DOM-observable assertions for reset, message, count, and scroll behavior.
- Use small fixture word lists in component tests to avoid depending on large dictionary files.
- Express the 10-word visible limit as a named constant if it is shared between CSS and tests.

## Completed Tests

- [x] makes the results list scrollable when more than 10 words match
- [x] sizes the results list to fit when 10 or fewer words match
- [x] focuses the first correct-position input when the reset button is clicked
- [x] renders all matching words when more than 10 words match
- [x] shows the result count when multiple words match
- [x] shows the result count when one word matches
- [x] hides the empty-results message when words match
- [x] shows an empty-results message when no words match
- [x] keeps the selected word length when the reset button is clicked
- [x] keeps the selected language when the reset button is clicked
- [x] clears absent-letter constraints when the reset button is clicked
- [x] clears present-letter constraints when the reset button is clicked
- [x] clears correct-letter constraints when the reset button is clicked
- [x] renders a reset button
