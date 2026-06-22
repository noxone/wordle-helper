# Tech Stack

- TypeScript `~5.9.3`, strict mode, ES2022 target, ESNext modules, bundler resolution, `noEmit`.
- Vite `^7.3.1` build/dev server; native browser DOM APIs and `fetch`.
- Vitest `^4.0.18`, Node test environment.
- Tailwind CSS `^4.1.18` via `@tailwindcss/postcss` and `@tailwindcss/vite`; PostCSS `^8.5.6`; Autoprefixer `^10.4.24`.
- npm package management; ESM package (`"type": "module"`).
- TypeScript quality gates include `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, and `erasableSyntaxOnly`.