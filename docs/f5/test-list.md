# Test List: F-5 Application Test Coverage >= 80%

## Current Focus

- None.

## Pending Tests

- None.

## Refactoring / Design Ideas

- Extract application startup from `main.ts` into a callable function so it can be smoke-tested without relying on module side effects.
- Keep browser API boundaries injectable for `fetch`, `localStorage`, and `navigator.language`.
- Keep coverage configuration in one place and avoid duplicating include/exclude patterns between scripts and Vitest config.
- Prefer observable DOM assertions in the smoke test over inspecting internal state.

## Completed Tests

- [x] runs the coverage command successfully
- [x] connects language selection, word-length selection, state updates, and rendered results during startup
- [x] initializes the app with mocked `navigator.language`
- [x] initializes the app with mocked `localStorage`
- [x] initializes the app without making a real network request
- [x] covers application initialization with a browser-environment smoke test
- [x] includes `src/components` in the enforced coverage threshold
- [x] includes `src/state` in the enforced coverage threshold
- [x] includes `src/logic` in the enforced coverage threshold
- [x] enforces at least 80 percent branch coverage across `src`
- [x] enforces at least 80 percent line coverage across `src`
- [x] reports coverage for all application code under `src`
