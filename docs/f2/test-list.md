# Test List: F-2 Filter Logic Coverage

## Current Focus

- [ ] `it.todo("keeps a word that matches a correct letter at its configured position")`

## Pending Tests

- [ ] `it.todo("excludes a word that does not match a correct letter at its configured position")`
- [ ] `it.todo("keeps a word that contains a present letter")`
- [ ] `it.todo("excludes a word that does not contain a present letter")`
- [ ] `it.todo("keeps a word that does not contain an absent letter")`
- [ ] `it.todo("excludes a word that contains an absent letter")`
- [ ] `it.todo("returns no words when absent letters eliminate every candidate")`
- [ ] `it.todo("allows a present letter at any position when it has no position rule")`
- [ ] `it.todo("allows a present letter outside all of its forbidden positions")`
- [ ] `it.todo("excludes a present letter from each of its forbidden positions")`
- [ ] `it.todo("returns no words when correct and present constraints conflict")`
- [ ] `it.todo("returns no words when the same letter is both correct and absent")`
- [ ] `it.todo("filters words with fewer than five letters")`
- [ ] `it.todo("filters words with more than five letters")`

## Refactoring / Design Ideas

- Keep each test focused on one observable filtering behavior.
- Use small, purpose-built word lists so failures identify the responsible constraint.
- Configure Vitest coverage for `src/logic/` and enforce at least 80% line and branch coverage.
- Do not add automatic word-length filtering; F-2 only verifies that the filter is length-agnostic.

## Completed Tests

- [x] returns every word when no constraints are configured
- [x] combines correct, present, and absent constraints
- [x] excludes a word when a present letter appears at a forbidden position
