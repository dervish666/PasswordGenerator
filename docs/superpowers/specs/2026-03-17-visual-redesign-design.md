# Visual Redesign: "The Terminal"

Full visual redesign of the Password Generator app. Drop Material UI, build custom CSS, dark theme with electric cyan accent, tasteful motion, public-facing bold & modern aesthetic.

## Context

The app currently uses default Material UI 5 styling — light theme, muted purple-blue primary, generic Paper card layout. It looks like a tutorial project. The goal is to make it feel like a confident, polished security tool that establishes trust instantly.

Design principles from `.impeccable.md`: instant trust, one job done well, bold not loud, accessible by default, copy-first interaction.

## Approach: "The Terminal"

Inspired by Raycast/Linear/Vercel. Near-black background, monospace passphrase display in a prominent panel, electric cyan accent used sparingly. The passphrase is the hero — the largest element on screen. Controls are understated. The terminal metaphor communicates "security tool" to a broad audience.

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0a0a0b` | Page background |
| `--surface` | `#141416` | Passphrase panel, elevated areas |
| `--border` | `rgba(255, 255, 255, 0.08)` | Panel borders, dividers |
| `--text-primary` | `#e8e8e8` | Body text, passphrase |
| `--text-secondary` | `#919191` | Labels, helper text, trust footer |
| `--accent` | `#00e5ff` | Buttons, slider fills, interactive elements |
| `--accent-glow` | `rgba(0, 229, 255, 0.15)` | Glow effects on hover/focus |
| `--success` | `#22c55e` | "Meets range" indicator |
| `--warning` | `#f59e0b` | Constraint warnings |

**Contrast ratios (computed):**
- `--text-primary` (#e8e8e8) on `--bg` (#0a0a0b): 16.2:1 (exceeds AAA)
- `--text-secondary` (#919191) on `--bg` (#0a0a0b): 6.3:1 (passes AA)
- `--text-secondary` (#919191) on `--surface` (#141416): 5.8:1 (passes AA)
- `--accent` (#00e5ff) on `--bg` (#0a0a0b): 12.9:1 (exceeds AAA)

## Typography

- **Body/UI:** `Inter` via Google Fonts. Clean, modern, excellent at small sizes. Replaces Roboto — Inter's geometric character and wider weight range better serve the bold/modern aesthetic while maintaining superior readability at small label sizes.
- **Passphrase:** `JetBrains Mono` via Google Fonts. Monospace, feels secure/technical, great legibility.
- **Font loading:** `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap">` — `display=swap` avoids FOIT.
- **Scale:**
  - Passphrase: `2rem` (hero — largest text on screen)
  - H1 title: `1.25rem` (deliberately quiet — doesn't compete with passphrase)
  - Body: `0.875rem`
  - Labels: `0.75rem`, uppercase, `0.05em` letter-spacing
- **Mobile:** Passphrase drops to `1.5rem`. Everything else stays the same.

## Layout

Full-height dark canvas. Content vertically centered on desktop, top-aligned with padding on mobile. Max-width `480px`.

**Structure (top to bottom):**

1. **App title** — "Password Generator" in `text-primary` at `1.25rem`. Tagline below in `text-secondary`: "Secure diceware passphrases, generated locally."
2. **Passphrase display panel** — `surface` background, `1px` border, subtle `accent-glow` box-shadow.
   - Passphrase rendered at `2rem` in `JetBrains Mono`. Each word is a separate `<span>` for independent animation. Words are separated by a literal space character between spans (not animated, always visible).
   - **Overflow:** Passphrase wraps naturally via `word-break: break-word`. If wrapping to multiple lines, animation still applies per-word (words on line 2+ simply appear in their natural position).
   - Below the passphrase: a status/action row with character count on the left, copy button on the right.
   - Copy button is an accent-colored pill (not a tiny icon). Text: "Copy" / "Copied!" `aria-label="Copy passphrase to clipboard"`.
   - Status line shows: `24 chars` and either `Meets range` (green) or constraint message (amber).
   - **Empty state** (before first generate): muted placeholder text — "Click generate to create a passphrase"
3. **Notification area** — Inline banner below the passphrase panel for generation warnings and errors (see Notification Design below). Not visible when there's nothing to report.
4. **Sliders** — Custom-styled `<input type="range">`. Thin track (`4px`), border-colored unfilled, accent-colored filled. Small accent circle thumb. Label on left ("Min characters"), value on right (`16`).
5. **Generate button** — Full-width, accent background, dark text. Primary action. Inline SVG refresh icon on the left (no icon library dependency).
6. **Trust footer** — Small muted text: "Generated locally. Never stored or transmitted."

## Notification Design

Replaces MUI's `<Snackbar>` + `<Alert>`. An inline banner that appears below the passphrase panel when needed.

**States:**
- **Warning** (amber border-left, amber icon): "Could not find an exact match for your length constraints. Showing closest result." — auto-dismisses after `6s`.
- **Error** (warning color, no passphrase shown): "Could not generate a passphrase with these constraints. Try widening the length range." — persists until next generate attempt.
- **Hidden**: When there's nothing to report, the banner is not rendered (no empty space).

**Styling:** `surface` background, `3px` left border in the notification color, small inline SVG warning icon, `text-secondary` text at `0.8125rem`. Fades in with `200ms` transition.

The copy success feedback remains on the CopyButton itself ("Copied!" state) — it does not use the notification banner.

## Progress Indicator

The current `<LinearProgress>` bar is **removed**. The status line text ("24 chars - Meets range" / "Below minimum") provides the same information more concisely and fits the terminal aesthetic better. A progress bar implies a target to "fill up" which doesn't match the min/max range model — the passphrase can be valid at any point within the range, not just at 100%.

## Component Architecture

Remove all MUI dependencies. Replace with:

### Icons

All icons are inline SVGs embedded directly in components. No icon library. Three icons needed:
- Refresh (generate button): simple circular arrow
- Copy (copy button): overlapping rectangles
- Check (copied state): checkmark

### Files to modify
- `src/index.js` — Remove MUI ThemeProvider, CssBaseline, createTheme. Render `<App />` inside `<ErrorBoundary>` directly.
- `src/App.js` — Replace all MUI components with semantic HTML + CSS classes. Import new sub-components.
- `src/ErrorBoundary.js` — Replace MUI components with styled HTML matching the new design system.
- `src/index.css` — Replace with the full design system (CSS custom properties, component styles, animations).
- `public/index.html` — Replace Google Fonts link (Roboto → Inter + JetBrains Mono with `display=swap`), update `theme-color` meta tag to `#0a0a0b`.
- `public/manifest.json` — Update `theme_color` to `#0a0a0b`, `background_color` to `#0a0a0b`, `name` to `"Password Generator"`.

### New files
- `src/components/PassphraseDisplay.js` — The hero panel: passphrase text with per-word spans, status line, copy button. Handles word animation state via CSS class toggling.
- `src/components/RangeSlider.js` — Custom range slider with accent styling and value label. Provides `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- `src/components/GenerateButton.js` — Full-width accent button with loading/shimmer state.
- `src/components/CopyButton.js` — Accent pill button with copy/copied states, inline SVG icons, and scale animation.
- `src/components/NotificationBanner.js` — Inline warning/error banner with auto-dismiss support.

### Dependencies to remove
- `@mui/material`
- `@mui/icons-material`
- `@emotion/react`
- `@emotion/styled`

## Motion Design

All animations are CSS-only (keyframes + transitions). No JS animation libraries.

### Passphrase reveal
- Each word fades in left-to-right, staggered: `0ms`, `120ms`, `240ms` delay
- Words translate `8px` up to `0px` as they appear
- Duration: `300ms` each, `ease-out`
- On regenerate: existing words fade out (`150ms`), then new words animate in

### Copy button
- Hover: fills with accent background, text goes dark
- Click: text swaps to "Copied!" + check icon, brief scale pulse (`1.0 -> 1.05 -> 1.0`, `200ms`), reverts after `2s`

### Generate button
- Hover: subtle accent glow (`box-shadow: 0 0 20px var(--accent-glow)`)
- Active: glow intensifies, slight scale down (`0.98`)
- Loading: text becomes "Generating...", CSS gradient shimmer sweeps L->R

### Sliders
- Thumb scales `1.0 -> 1.3` on hover/drag
- Track fill transitions smoothly

### Notification banner
- Fades in (`200ms`) when shown
- Fades out before removal

### Page load
- Title and controls fade in together (`300ms`)
- No passphrase visible until first generate
- Wordlist fetch happens on first generate click — the generate button shows "Generating..." with shimmer during both the fetch and generation. No separate "warming up" state needed since the fetch is fast and transparent to the user.

### Reduced motion
- `prefers-reduced-motion: reduce` disables all transforms and animations
- Falls back to instant state changes

## Accessibility

- All text meets WCAG AA contrast (see Color Palette section for computed ratios)
- Custom focus-visible ring: `2px solid var(--accent)` with `2px` offset on all interactive elements
- Range sliders provide `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Passphrase display area has `aria-live="polite"` for screen reader announcements on new passphrases
- Copy button: `aria-label="Copy passphrase to clipboard"`, changes to `aria-label="Passphrase copied"` on success
- Notification banner has `role="alert"` for screen reader announcement
- `prefers-reduced-motion` respected throughout (see Motion Design)
- Keyboard navigation: Tab order follows DOM/visual order top-to-bottom — Copy button (when passphrase visible) → Min slider → Max slider → Generate button. All keyboard-accessible. No `tabindex` manipulation needed — natural DOM order matches the layout.

## Testing

- `src/wordListUtils.test.js` — Unaffected. Logic layer is unchanged.
- `src/App.test.js` — Requires updates:
  - Remove `ThemeProvider` wrapper from `renderApp()` helper
  - Replace `getByDisplayValue('alpha bravo charlie')` with `getByText('alpha bravo charlie')` or `getByTestId('passphrase-display')` — the passphrase is now rendered as `<span>` elements inside a `<div>`, not an `<input>`
  - Replace `getByLabelText('copy to clipboard')` with `getByLabelText('Copy passphrase to clipboard')` to match new aria-label
  - Replace `getByLabelText('Minimum character length')` / `getByLabelText('Maximum character length')` — verify these aria-labels are preserved on the new `RangeSlider` component
- `src/ErrorBoundary` — Verify renders correctly with new styling (no MUI dependencies)
- Manual checks: reduced-motion mode, keyboard tab order, screen reader passphrase announcement, notification banner announcement

## Deployment Changes

- `nginx.conf` CSP: `style-src` and `font-src` already allow `fonts.googleapis.com` and `fonts.gstatic.com`. Verify these remain correct after the Roboto → Inter/JetBrains Mono change (same CDN, no change needed).
- `public/manifest.json`: `theme_color` → `#0a0a0b`, `background_color` → `#0a0a0b`, `name` → `"Password Generator"`.
- `public/index.html`: `theme-color` meta → `#0a0a0b`.

## Dependencies

### Add
- None (fonts loaded via Google Fonts CDN)

### Remove
- `@mui/material`
- `@mui/icons-material`
- `@emotion/react`
- `@emotion/styled`

This reduces the JS bundle significantly. The entire UI becomes CSS + vanilla React.
