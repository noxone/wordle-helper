# Wordle Helper

A tiny tool to help finding the right words for wordle.

## Prerequisites

Use Node.js 24 LTS. The required major version is declared in `package.json`.

On macOS, install it with Homebrew:

```bash
brew install node@24
```

Because `node@24` is keg-only, add it to your `PATH`.

Apple Silicon:

```bash
echo 'export PATH="/opt/homebrew/opt/node@24/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Intel:

```bash
echo 'export PATH="/usr/local/opt/node@24/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Alternatively, install Node.js 24 LTS from the
[official download page](https://nodejs.org/en/download).

Verify the active version:

```bash
node --version
```

## Development

- Clone repository
- run `npm install`
- run `npm run dev` to have nice development server
