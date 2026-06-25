# Spec: F-i18n UI Internationalization

## Objective

Internationalize the WordleHelper user interface so visible UI text can be rendered in more than one language without changing the selected word-list language.

The feature must separate:

- `wordLocale`: the language of the loaded dictionary and available word lengths
- `uiLocale`: the language used for labels, headings, help text, placeholders, document title, and accessibility labels

Initial UI languages are German and English. English is the fallback UI language when browser detection does not match a supported UI locale.

## Tech Stack

- Vanilla TypeScript DOM application
- Vite build pipeline
- Vitest with jsdom for DOM behavior tests
- No UI framework
- No i18n runtime dependency unless a later feature needs pluralization, ICU formatting, remote translation loading, or translator workflow integration

## Commands

- Install: `npm ci`
- Dev server: `npm run dev`
- Build: `npm run build`
- Test: `npm test -- --run`
- Coverage: `npm run test:coverage`

## Project Structure

- `src/i18n/` -> UI message catalogs, locale detection, translation helpers, and DOM translation application
- `src/browser/` -> browser-facing initialization and persistence wiring
- `src/components/` -> DOM components; components receive already translated labels or use shared i18n helpers where appropriate
- `src/logic/languages.ts` -> word-list language support only; this remains dictionary-focused
- `src/tests/` -> unit and jsdom tests for catalogs, translation helpers, and integration behavior
- `docs/F-i18n/spec.md` -> this feature specification

## Code Style

Use a typed message catalog so every supported UI locale must provide the same keys:

```ts
export const messages = {
    de: {
        appTitle: "Wordle Helper",
        wordLanguageLabel: "Wortsprache",
        wordLengthLabel: "Wortlänge",
    },
    en: {
        appTitle: "Wordle Helper",
        wordLanguageLabel: "Word language",
        wordLengthLabel: "Word length",
    },
} as const;

export type UiLocale = keyof typeof messages;
export type MessageKey = keyof typeof messages.de;

export function t(locale: UiLocale, key: MessageKey): string {
    return messages[locale][key];
}
```

Static HTML text should be bound with stable translation keys:

```html
<label for="language" data-i18n="wordLanguageLabel"></label>
<input id="absent" data-i18n-placeholder="absentLettersPlaceholder" />
```

Translation application should update observable DOM state:

```ts
document.documentElement.lang = uiLocale;
document.title = t(uiLocale, "appTitle");
```

## Functional Requirements

- Translate all static user-visible UI text currently hard-coded in `index.html`.
- Translate input placeholders and accessibility labels where present.
- Set `<html lang>` to the active `uiLocale`.
- Set `document.title` from the active UI messages.
- Detect the initial UI locale from `navigator.language`.
- Do not add a visible UI language selector in the first implementation.
- Persist the detected UI locale with a storage key separate from the word-list locale key, so future UI-language controls can reuse the same state.
- Keep the existing word-list language selector focused on dictionary language.
- Keep dictionary language labels as self-names, for example "Deutsch", "English", and "Español", regardless of the active UI locale.
- Rename the visible dictionary selector label from "Sprache" to "Wortsprache" / "Word language" to avoid ambiguity.
- Changing `uiLocale` must not reload the word list, change word length, clear constraints, or mutate `wordLocale`.
- Changing `wordLocale` must keep the selected `uiLocale`.
- Unsupported browser UI locales fall back to English.
- Missing message keys should be caught by TypeScript or tests before runtime.

## Testing Strategy

Use Vitest and jsdom.

Unit tests:

- UI locale detection maps supported browser locales such as `en-US` to `en`.
- Unsupported browser locales fall back to `en`.
- Stored UI locale wins over browser detection.
- Message catalogs expose identical keys for all supported UI locales.
- Translation helper returns the expected text for German and English.

DOM tests:

- Applying German translations updates labels, help text, placeholders, title, and `<html lang>`.
- Applying English translations updates the same DOM elements without reinitializing app state.
- The dictionary language selector label uses the UI locale while selector options remain self-names from `supportedLanguages`.
- No visible UI language selector is rendered in the first implementation.

Integration tests:

- Changing dictionary language still loads `/public/{wordLocale}/{length}.txt` or the existing root-relative URL pattern used by the app.
- Changing UI language does not call word-list fetching.
- Existing app initialization tests continue to pass with translated markup.

## Boundaries

- Always: keep dictionary locale and UI locale separate.
- Always: keep English copy as the fallback when browser UI language is unsupported.
- Always: keep dictionary language labels as self-names.
- Always: prefer typed in-repo message catalogs for the current feature scope.
- Always: update tests when adding or changing translation keys.
- Ask first: adding an external i18n dependency.
- Ask first: making the dictionary selector also change the UI language.
- Ask first: adding a visible UI language selector.
- Ask first: adding translated word-list metadata beyond current language labels.
- Never: make translation loading depend on network access at runtime.
- Never: remove support for any existing word-list language.

## Success Criteria

- All visible static UI copy can be rendered in German and English.
- `wordLocale` and `uiLocale` have separate persistence and behavior.
- Browser UI locale detection works for supported locales and falls back to English otherwise.
- No visible UI language selector is added in the first implementation.
- Dictionary language labels stay as self-names regardless of UI locale.
- The app updates `document.title` and `<html lang>` according to `uiLocale`.
- Changing UI language does not reload word lists or clear constraints.
- Changing word-list language does not change UI language.
- `npm test -- --run` passes.
- `npm run build` passes.

## Resolved Decisions

- The first implementation uses browser-detected UI language only; no visible UI language selector is added.
- Dictionary language labels remain self-names regardless of UI locale.
- Unsupported browser UI locales fall back to English.
