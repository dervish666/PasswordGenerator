# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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
