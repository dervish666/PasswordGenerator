# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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
