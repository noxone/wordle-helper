# Test List: F-2 Filter Logic Coverage

## Current Focus

- None.

## Pending Tests

- None.

## Refactoring / Design Ideas

- Keep each test focused on one observable filtering behavior.
- Use small, purpose-built word lists so failures identify the responsible constraint.
- Configure Vitest coverage for `src/logic/` and enforce at least 80% line and branch coverage.
- Do not add automatic word-length filtering; F-2 only verifies that the filter is length-agnostic.

## Completed Tests

- [x] returns every word when no constraints are configured
- [x] keeps a word that matches a correct letter at its configured position
- [x] excludes a word that does not match a correct letter at its configured position
- [x] keeps a word that contains a present letter
- [x] excludes a word that does not contain a present letter
- [x] keeps a word that does not contain an absent letter
- [x] excludes a word that contains an absent letter
- [x] returns no words when absent letters eliminate every candidate
- [x] allows a present letter at any position when it has no position rule
- [x] allows a present letter outside all of its forbidden positions
- [x] excludes a present letter from each of its forbidden positions
- [x] returns no words when correct and present constraints conflict
- [x] returns no words when the same letter is both correct and absent
- [x] filters words with fewer than five letters
- [x] filters words with more than five letters
- [x] combines correct, present, and absent constraints
- [x] excludes a word when a present letter appears at a forbidden position
