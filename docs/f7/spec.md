# Spec: F-7 GitHub Actions CI/CD

## Objective

Add GitHub Actions workflows that verify the application on every change to `main` and deploy successful `main` builds to GitHub Pages.

## CI Workflow

File: `.github/workflows/ci.yml`

The CI workflow must:

- Run on `push` to `main`
- Run on `pull_request` targeting `main`
- Use Node.js `24.x`
- Install dependencies with `npm ci`
- Build the application with `npm run build`
- Run coverage verification with `npm run test:coverage`
- Fail when Vitest coverage drops below the configured 80% line or branch threshold
- Upload the generated `dist/` build as a downloadable CI artifact
- Upload the generated coverage report as a downloadable CI artifact

## Deploy Workflow

File: `.github/workflows/deploy.yml`

The deploy workflow must:

- Run after the CI workflow completes successfully for a `push` to `main`
- Use Node.js `24.x`
- Install dependencies with `npm ci`
- Build the application with `npm run build`
- Upload the generated `dist/` directory as a GitHub Pages artifact
- Deploy the uploaded artifact with `actions/deploy-pages`
- Declare the GitHub Pages permissions required for deployment
- Use the `github-pages` environment
- Serve the app from the custom domain root `https://wordle.olafneumann.org/`

## Commands

- Install: `npm ci`
- Build: `npm run build`
- Coverage: `npm run test:coverage`

## Testing Strategy

No Vitest tests are required for F-7 for now.

Verification is done by:

- Running `npm run build` locally
- Running `npm run test:coverage` locally
- Inspecting workflow YAML for the required triggers, commands, permissions, and Pages deployment steps
- Inspecting workflow YAML for downloadable build and coverage artifacts
- Letting GitHub Actions execute CI after pushing to `main` or opening a pull request
- Letting GitHub Actions execute deployment after CI succeeds for a `main` push
- Confirming the production build uses root-relative app assets, not a repository subdirectory base path

## Boundaries

- Always: keep workflow commands aligned with `package.json`
- Always: deploy only generated `dist/` output
- Ask first: adding new CI dependencies, new scripts, or external services
- Never: commit secrets or hard-code credentials in workflow files

## Success Criteria

- `.github/workflows/ci.yml` exists and runs install, build, and coverage on push/pull request for `main`
- CI uploads downloadable artifacts for the built app and coverage report
- `.github/workflows/deploy.yml` exists and deploys `dist/` to GitHub Pages after CI succeeds on push to `main`
- The app is configured for the custom domain root `https://wordle.olafneumann.org/`
- Coverage failures block CI through the existing Vitest thresholds
- Local `npm run build` and `npm run test:coverage` pass before marking F-7 complete
