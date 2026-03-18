# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Codebase Structure Index

The file map below provides instant orientation. For detailed export signatures and dependencies, read the relevant `.claude/structure/*.yaml` file for the directory you're working in.

After adding, removing, or renaming source files or public classes/functions, update both the file map below and the relevant structure YAML file.

### File Map

<!-- One line per source file: relative path - brief description -->
src/main.jsx - App entry point, ErrorBoundary wrapper, React root render
src/App.jsx - Main UI component: passphrase generation, copy-to-clipboard, min/max length sliders
src/ErrorBoundary.jsx - React error boundary with fallback UI
src/index.css - "The Terminal" design system: CSS tokens, component styles, animations, reduced-motion
src/wordListUtils.js - Fetches wordlist.txt (7772 EFF diceware words), generates length-constrained passphrases
src/components/CopyButton.jsx - Accent pill button with copy/copied states, inline SVG icons
src/components/RangeSlider.jsx - Custom range slider with accent track fill and value label
src/components/GenerateButton.jsx - Full-width accent button with loading shimmer state
src/components/NotificationBanner.jsx - Inline warning/error banner with auto-dismiss
src/components/PassphraseDisplay.jsx - Hero panel: passphrase word spans, status line, copy button
vite.config.js - Vite config: React plugin, dev server port 3000, build to build/, vitest setup

index.html - HTML shell with Google Fonts (Inter + JetBrains Mono), module script entry point
public/wordlist.txt - EFF Large Diceware wordlist (7772 words, one per line)
public/manifest.json - PWA manifest

Dockerfile - Multi-stage build: node:18-alpine → nginx:alpine
nginx.conf - Nginx config with security headers (CSP, X-Frame-Options, etc.)

## Project Overview

A lightweight React app that generates secure multi-word passphrases from the EFF Large Diceware wordlist (7772 words). Users configure min/max character length via sliders; the generator finds a passphrase within those constraints. Built with Vite and custom CSS ("The Terminal" dark theme with electric cyan accent). All generation happens client-side — no backend.

## Commands

- `npm start` — Vite dev server on localhost:3000
- `npm run build` — Vite production build to `build/`
- `npm test` — run tests (Vitest)
- `npm run test:watch` — run tests in watch mode
- `npm run preview` — preview production build locally
- `docker build -t password-generator .` — multi-stage Docker build (node:18-alpine → nginx:alpine, serves on port 80)

## Architecture

The app is a single-page React application:

- `src/main.jsx` — Entry point. Renders `<App />` inside `<ErrorBoundary>` and `<StrictMode>`.
- `src/index.css` — "The Terminal" design system. CSS custom properties for colors/fonts, component styles, keyframe animations (word reveal, shimmer, pulse), and `prefers-reduced-motion` support.
- `src/App.jsx` — Main component. Manages state for passphrase, sliders, generation, and notifications. Composes PassphraseDisplay, RangeSlider, GenerateButton, and NotificationBanner.
- `src/components/PassphraseDisplay.jsx` — Hero panel. Renders each word as an animated `<span>`, shows character count and range status, includes CopyButton.
- `src/components/CopyButton.jsx` — Accent pill button. Shows "Copy" → "Copied!" with 2s auto-revert and scale pulse animation.
- `src/components/RangeSlider.jsx` — Custom `<input type="range">` with accent-colored fill track, label, and value display.
- `src/components/GenerateButton.jsx` — Full-width accent button with shimmer animation during loading.
- `src/components/NotificationBanner.jsx` — Inline alert banner for warnings/errors with optional auto-dismiss timer.
- `src/ErrorBoundary.jsx` — Class component that catches render errors and displays a fallback UI with a refresh prompt.
- `src/wordListUtils.js` — Fetches `public/wordlist.txt` (7772 EFF diceware words) via `fetch('/wordlist.txt')`, caches in memory, uses `crypto.getRandomValues()` with rejection sampling for unbiased randomness, and Fisher-Yates shuffle for word selection. Exports four functions: `getRandomWord()`, `getRandomWords(count)`, `getRandomWordsWithinLength(min, max, attempts)`, and `clearWordListCache()`.

The wordlist lives at `public/wordlist.txt` and is served as a static asset. It is **not** bundled into JS — it's fetched at runtime and cached.

## Docker Deployment

The `Dockerfile` uses a two-stage build: builds the React app with node:18-alpine, then copies the `build/` output into nginx:alpine with a custom `nginx.conf` that sets security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy). Run with `docker run -p 8080:80 password-generator`. Targeted at Unraid server deployment.

## UI Design Workflow

When asked to design UI or frontend interfaces, follow the step-by-step workflow defined in `.cursor/rules/design.mdc`:
1. Layout design (ASCII wireframe) → get user approval
2. Theme design → get user approval
3. Animation design → get user approval
4. Generate HTML file

Design iterations go in `.superdesign/design_iterations/` with naming convention `{name}_{n}.html`. Use Flowbite as base styling, avoid indigo/blue unless requested, use Google Fonts.
