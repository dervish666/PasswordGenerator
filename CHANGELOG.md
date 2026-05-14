# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [2.4.0] - 2026-05-14

### Added
- **Humor engine** — passphrases now use incongruity-based word pairing for memorable, funny combinations. 600+ words tagged across 11 categories (animals, foods, grand adjectives, silly adjectives, body parts, dramatic actions, mundane actions, mundane objects, fancy objects, nature, sounds) with 29 templates that cross categories for maximum absurdity
- **34 bonus words** added to the wordlist — comedy staples missing from the EFF list (noodle, turnip, llama, kazoo, spatula, hedgehog, etc.)

### Changed
- Passphrase generation now defaults to humor-aware word selection, falling back to fully random if length constraints can't be met with tagged words

## [2.3.0] - 2026-05-05

### Changed
- **Bumped Docker base image** from `node:18-alpine` to `node:22-alpine` — Vite 8 requires Node 20.19+ and was failing the build
- **React 18 → 19** (`react`, `react-dom` to ^19.2.5) — no app code changes needed
- **Vite 8.0.0 → 8.0.10**
- **Vitest 4.1.0 → 4.1.5**
- **jsdom 29.0.0 → 29.1.1**
- **@peculiar/webcrypto 1.5.0 → 1.7.1**

### Security
- Resolved moderate-severity `yaml` advisory (GHSA-48c2-rrv3-qjmp) via `npm audit fix`

## [2.2.0] - 2026-05-05

### Added
- **Character requirement toggles** — Capital letter, Number, and Special char options for sites that demand them. The passphrase words stay readable; extras are appended at the start (capital) or end (digit, symbol)

### Changed
- Rewrote `CLAUDE.md` for clarity — condensed architecture overview, added design tokens, removed structure index

### Fixed
- `.gitignore` — split malformed `*.swo.superpowers/` line and added `.superpowers/` for local tooling

## [2.1.0] - 2026-03-18

### Changed
- **Migrated from Create React App to Vite** — faster dev server, faster builds, modern toolchain
- **Migrated from Jest to Vitest** — same test API, runs on Vite infrastructure
- Renamed `.js` → `.jsx` for all files containing JSX
- Entry point renamed from `src/index.js` to `src/main.jsx`
- `index.html` moved from `public/` to project root (Vite convention)

### Security
- **Resolved all 26 npm vulnerabilities** — all were in `react-scripts` transitive dependencies (jest 27, jsdom, webpack-dev-server, postcss, svgo, serialize-javascript, underscore)

### Removed
- `react-scripts` dependency and all CRA tooling

## [2.0.1] - 2026-03-17

### Changed
- Widened app container from 480px to 560px so three-word passphrases (~20 chars) display on one line

## [2.0.0] - 2026-03-17

### Changed
- **Full visual redesign** — "The Terminal" dark theme with electric cyan accent, replacing the default Material UI light theme
- **Dropped Material UI** — replaced with custom CSS design system and 5 new React components (CopyButton, RangeSlider, GenerateButton, NotificationBanner, PassphraseDisplay)
- **Typography** — switched from Roboto to Inter (UI) and JetBrains Mono (passphrase display)
- **Passphrase display** — hero panel with per-word staggered reveal animation, monospace font at 2rem
- **Copy button** — accent-colored pill with "Copy" / "Copied!" states and scale pulse animation
- **Generate button** — full-width accent button with CSS shimmer animation during loading
- **Notifications** — inline banner replacing MUI Snackbar, with auto-dismiss for warnings
- **Sliders** — custom-styled range inputs with accent fill track

### Added
- `prefers-reduced-motion` support — disables all animations for users who prefer reduced motion
- WCAG AA contrast compliance on all text (verified ratios in spec)
- `aria-live="polite"` on passphrase display for screen reader announcements
- Visible focus rings on all interactive elements

### Removed
- `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` dependencies
- `LinearProgress` bar (replaced by status text)

## [1.0.0] - 2026-03-16

### Added
- Initial release — passphrase generator with EFF diceware wordlist, Material UI interface
