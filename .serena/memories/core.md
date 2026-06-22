# Project Core

- Single-module browser app: vanilla TypeScript DOM manipulation; no UI framework.
- Entry/wiring: `src/main.ts`; state orchestration: `src/state/store.ts`; pure filtering: `src/logic/filter.ts`; DOM components: `src/components/`; constants: `src/constants.ts`.
- Flow: DOM input callbacks mutate `WordleState` -> state constructs `AppState` -> `filterWords` applies constraints -> update callback renders results.
- Runtime word list is fetched from `public/en/5.txt`; `data/` holds source/raw lists and is not served directly.
- Word constraints: exact-position letters, present letters plus per-position rules, absent letters.
- UI document language and labels are German; preserve German for new UI copy unless localization is explicitly in scope.
- Read `mem:tech_stack` for tooling/configuration, `mem:conventions` for implementation rules, `mem:suggested_commands` for daily commands, and `mem:task_completion` before handing off code changes.