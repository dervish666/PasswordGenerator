# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Codebase Structure Index

The file map below provides instant orientation. For detailed export signatures and dependencies, read the relevant `.claude/structure/*.yaml` file for the directory you're working in.

After adding, removing, or renaming source files or public classes/functions, update both the file map below and the relevant structure YAML file.

### File Map

<!-- One line per source file: relative path - brief description -->
src/index.js - App entry point, MUI theme config, ErrorBoundary wrapper, React root render
src/App.js - Main UI component: passphrase generation, copy-to-clipboard, min/max length sliders
src/ErrorBoundary.js - React error boundary with fallback UI
src/index.css - Base body/code font styles
src/wordListUtils.js - Fetches wordlist.txt (7772 EFF diceware words), generates length-constrained passphrases

public/index.html - HTML shell with Google Fonts (Roboto) and root div
public/wordlist.txt - EFF Large Diceware wordlist (7772 words, one per line)
public/manifest.json - PWA manifest

Dockerfile - Multi-stage build: node:18-alpine → nginx:alpine
nginx.conf - Nginx config with security headers (CSP, X-Frame-Options, etc.)

## Project Overview

A lightweight React app that generates secure multi-word passphrases from the EFF Large Diceware wordlist (7772 words). Users configure min/max character length via sliders; the generator finds a passphrase within those constraints. Built with Create React App and Material UI 5. All generation happens client-side — no backend.

## Commands

- `npm start` — dev server on localhost:3000
- `npm run build` — production build to `build/`
- `npm test` — run tests (Jest via react-scripts)
- `docker build -t password-generator .` — multi-stage Docker build (node:18-alpine → nginx:alpine, serves on port 80)

## Architecture

The app is a single-page React application:

- `src/index.js` — Entry point. Creates the MUI theme (primary `#556cd6`, secondary `#19857b`) and renders `<App />` inside `<ErrorBoundary>` and `<ThemeProvider>`.
- `src/App.js` — The entire UI in one component. Manages state for the generated password, copy-to-clipboard feedback, and min/max character length sliders (default 16–32). Calls `getRandomWordsWithinLength(min, max)` to generate passphrases.
- `src/ErrorBoundary.js` — Class component that catches render errors and displays a fallback UI with a refresh prompt.
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
