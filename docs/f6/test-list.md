# Test List: F-6 UX Improvements

## Current Focus

- [ ] renders a reset button

## Pending Tests

- [ ] clears correct-letter constraints when the reset button is clicked
- [ ] clears present-letter constraints when the reset button is clicked
- [ ] clears absent-letter constraints when the reset button is clicked
- [ ] keeps the selected language when the reset button is clicked
- [ ] keeps the selected word length when the reset button is clicked
- [ ] shows an empty-results message when no words match
- [ ] hides the empty-results message when words match
- [ ] shows the result count when one word matches
- [ ] shows the result count when multiple words match
- [ ] renders all matching words when more than 10 words match
- [ ] sizes the results list to fit when 10 or fewer words match
- [ ] makes the results list scrollable when more than 10 words match

## Refactoring / Design Ideas

- Keep reset behavior centralized in `WordleState` so UI components do not clear constraints independently.
- Keep result count and empty-results rendering near the possible-words component.
- Prefer DOM-observable assertions for reset, message, count, and scroll behavior.
- Use small fixture word lists in component tests to avoid depending on large dictionary files.
- Express the 10-word visible limit as a named constant if it is shared between CSS and tests.

## Completed Tests

- None.
