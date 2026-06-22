# Conventions

- Keep business filtering in pure functions under `src/logic/`; `WordleState` owns mutable constraint state, converts it to `AppState`, and triggers callbacks.
- Components use direct DOM creation/event listeners and receive DOM elements, state, and callbacks explicitly; do not introduce a framework without an intentional architecture change.
- Represent present/absent membership with `Set<string>` and per-letter position rules as `Record`-style `PresentRules` values containing `Set<number>`.
- Normalize runtime word-list and absent-letter input to uppercase; empty strings represent unset positional letters.
- Use `import type` for type-only dependencies. Explicit `.ts` import suffixes are permitted by TypeScript config, though existing imports are mixed.
- Styling is Tailwind utility classes in HTML/DOM class strings; `src/style.css` loads Tailwind.
- Tests live in `src/tests/`, use Vitest, and target pure logic rather than DOM-heavy state where practical.
- German is the default language for user-visible labels and explanatory text.