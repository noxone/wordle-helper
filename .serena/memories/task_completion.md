# Task Completion

For code changes, run from repository root:

1. `npm test -- --run` — all Vitest tests must pass once without watch mode.
2. `npm run build` — strict TypeScript checks and Vite production build must succeed.

There is no configured standalone lint or format script. Do not claim lint/format verification unless tooling is added or an explicit command was run. For UI changes, also exercise the affected interaction through `npm run dev` when browser verification is available.