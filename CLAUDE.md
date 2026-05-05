# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A client-side React app that generates secure multi-word passphrases from the EFF Large Diceware wordlist (7772 words). Users configure min/max character length via sliders; the generator finds a passphrase within those constraints. Built with Vite, custom CSS ("The Terminal" dark theme), and no component libraries. No backend — all generation happens in the browser using `crypto.getRandomValues()`.

## Commands

- `npm start` — Vite dev server on localhost:3000
- `npm run build` — production build to `build/`
- `npm test` — run all tests (Vitest)
- `npm run test:watch` — run tests in watch mode
- `npx vitest run src/components/CopyButton.test.jsx` — run a single test file
- `npx vitest run -t "shows character count"` — run tests matching a name pattern
- `npm run preview` — preview production build locally
- `docker build -t password-generator .` — Docker build (node:22-alpine → nginx:alpine, serves on port 80)
- `docker run -p 8080:80 password-generator` — run the Docker container

## Architecture

Single-page React 18 app. State lives in `App.jsx`; components are presentational with callbacks.

**Data flow:** App.jsx holds all state (password, sliders, generating, notification) → passes props down to 4 child components → receives callbacks up (onChange, onClick, onCopy, onDismiss).

**Passphrase generation:** `wordListUtils.js` fetches `public/wordlist.txt` once via `fetch('/wordlist.txt')`, caches in memory, then uses `crypto.getRandomValues()` with rejection sampling and Fisher-Yates shuffle. The wordlist is a static asset, not bundled into JS.

**Component tree:**
```
main.jsx → ErrorBoundary → App
  App → PassphraseDisplay → CopyButton
  App → NotificationBanner
  App → RangeSlider (×2: min + max)
  App → GenerateButton
```

**Styling:** Pure CSS in `src/index.css` using custom properties. No CSS-in-JS, no preprocessor. All animations are CSS keyframes with `prefers-reduced-motion` support.

## Design System Tokens

The visual theme is defined as CSS custom properties in `src/index.css`:

```
--bg: #0a0a0b          --accent: #00e5ff
--surface: #141416      --accent-glow: rgba(0, 229, 255, 0.15)
--text-primary: #e8e8e8 --success: #22c55e
--text-secondary: #919191 --warning: #f59e0b
--font-body: 'Inter'    --font-mono: 'JetBrains Mono'
```

Full design context and principles are in `.impeccable.md`.

## Testing

Tests use **Vitest** (not Jest). The API is nearly identical but mocking uses `vi` instead of `jest`:
- `vi.fn()`, `vi.spyOn()`, `vi.useFakeTimers()`, `vi.advanceTimersByTime()`
- Vitest globals (`describe`, `test`, `expect`) are enabled via `vite.config.js`
- Setup file: `src/setupTests.js` — imports `@testing-library/jest-dom` and polyfills `crypto.getRandomValues` for jsdom
- JSX test files use `.test.jsx` extension

## Docker Deployment

Two-stage build: node:22-alpine builds the app, nginx:alpine serves `build/` with security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) defined in `nginx.conf`. The CSP allows Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`). Targeted at Unraid server deployment.
