# Visual Redesign: "The Terminal" — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default MUI look with a custom dark-theme design system ("The Terminal") — near-black background, electric cyan accent, monospace passphrase display, tasteful motion.

**Architecture:** Drop all Material UI dependencies. Build 5 new components (CopyButton, RangeSlider, GenerateButton, NotificationBanner, PassphraseDisplay) with CSS custom properties for theming. All animations are CSS-only. The passphrase display is the hero element.

**Tech Stack:** React 18, custom CSS (no preprocessor), Inter + JetBrains Mono via Google Fonts, inline SVG icons.

**Spec:** `docs/superpowers/specs/2026-03-17-visual-redesign-design.md`

---

## File Structure

```
src/
  index.js              — MODIFY: strip MUI, render App directly
  index.css             — REWRITE: full design system (tokens, components, animations)
  App.js                — REWRITE: semantic HTML + new components, state management preserved
  ErrorBoundary.js      — MODIFY: replace MUI with styled HTML
  components/
    CopyButton.js       — NEW: accent pill button, copy/copied states, inline SVG
    CopyButton.test.js  — NEW: tests for copy states and clipboard interaction
    RangeSlider.js      — NEW: custom range input with accent styling
    RangeSlider.test.js — NEW: tests for value changes and aria attributes
    GenerateButton.js   — NEW: full-width accent button with loading state
    GenerateButton.test.js — NEW: tests for loading/disabled states
    NotificationBanner.js — NEW: inline warning/error banner with auto-dismiss
    NotificationBanner.test.js — NEW: tests for show/hide/auto-dismiss
    PassphraseDisplay.js — NEW: hero panel with word spans, status line, copy button
    PassphraseDisplay.test.js — NEW: tests for display states and animation classes
  App.test.js           — MODIFY: remove MUI wrapper, update selectors
public/
  index.html            — MODIFY: swap fonts, update theme-color
  manifest.json         — MODIFY: update colors and name
```

---

### Task 1: Foundation — CSS Design System & Static Assets

Update static files with the new theme tokens, fonts, and design system CSS. This is the visual foundation everything else builds on.

**Files:**
- Rewrite: `src/index.css`
- Modify: `public/index.html`
- Modify: `public/manifest.json`

- [ ] **Step 1: Rewrite `src/index.css` with the full design system**

```css
/* ========================================
   Design System: "The Terminal"
   ======================================== */

/* --- Tokens --- */
:root {
  --bg: #0a0a0b;
  --surface: #141416;
  --border: rgba(255, 255, 255, 0.08);
  --text-primary: #e8e8e8;
  --text-secondary: #919191;
  --accent: #00e5ff;
  --accent-glow: rgba(0, 229, 255, 0.15);
  --success: #22c55e;
  --warning: #f59e0b;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}

/* --- Reset & Base --- */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* --- Layout --- */
.app-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 600px) {
  .app-container {
    justify-content: flex-start;
    padding-top: 3rem;
  }
}

/* --- Typography --- */
.app-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 0.25rem;
}

.app-tagline {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
}

.label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

/* --- Passphrase Panel --- */
.passphrase-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 30px var(--accent-glow);
}

.passphrase-text {
  font-family: var(--font-mono);
  font-size: 2rem;
  color: var(--text-primary);
  word-break: break-word;
  line-height: 1.4;
  min-height: 2.8rem;
}

@media (max-width: 600px) {
  .passphrase-text {
    font-size: 1.5rem;
  }
}

.passphrase-placeholder {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-secondary);
  min-height: 2.8rem;
  display: flex;
  align-items: center;
}

.passphrase-word {
  display: inline;
  opacity: 0;
  transform: translateY(8px);
  animation: wordReveal 300ms ease-out forwards;
}

.passphrase-word:nth-child(2) { animation-delay: 120ms; }
.passphrase-word:nth-child(3) { animation-delay: 240ms; }
.passphrase-word:nth-child(4) { animation-delay: 360ms; }
.passphrase-word:nth-child(5) { animation-delay: 480ms; }
.passphrase-word:nth-child(6) { animation-delay: 600ms; }

.passphrase-word.fade-out {
  animation: wordFadeOut 150ms ease-in forwards;
}

@keyframes wordReveal {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes wordFadeOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-4px); }
}

/* --- Status Row --- */
.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  gap: 0.5rem;
}

.status-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.status-text--success {
  color: var(--success);
  font-weight: 500;
}

.status-text--warning {
  color: var(--warning);
  font-weight: 500;
}

/* --- Copy Button --- */
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: transparent;
  color: var(--accent);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 200ms, color 200ms, transform 200ms;
  flex-shrink: 0;
}

.copy-btn:hover {
  background: var(--accent);
  color: var(--bg);
}

.copy-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.copy-btn--copied {
  animation: copyPulse 200ms ease-out;
}

@keyframes copyPulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.copy-btn svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* --- Range Slider --- */
.slider-group {
  margin-bottom: 1rem;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.slider-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  outline: none;
  cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  transition: transform 150ms;
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.3);
}

.slider-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  transition: transform 150ms;
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.3);
}

.slider-input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* --- Generate Button --- */
.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: box-shadow 200ms, transform 100ms;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
}

.generate-btn:hover:not(:disabled) {
  box-shadow: 0 0 20px var(--accent-glow);
}

.generate-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 0 30px var(--accent-glow);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.generate-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.generate-btn--loading {
  background: linear-gradient(
    90deg,
    var(--accent) 0%,
    rgba(0, 229, 255, 0.6) 50%,
    var(--accent) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.generate-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* --- Notification Banner --- */
.notification {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--warning);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  animation: fadeIn 200ms ease-out;
}

.notification svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: var(--warning);
  stroke-width: 2;
  flex-shrink: 0;
  margin-top: 1px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* --- Trust Footer --- */
.trust-footer {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}

/* --- Error Boundary --- */
.error-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.error-message {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.error-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: box-shadow 200ms;
}

.error-btn:hover {
  box-shadow: 0 0 20px var(--accent-glow);
}

.error-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* --- Page Load Animation --- */
.app-fade-in {
  animation: fadeIn 300ms ease-out;
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .passphrase-word {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Update `public/index.html`**

Replace the Google Fonts `<link>` tag and update theme-color:

```html
<!-- Replace lines 7 and 15-18 -->
<meta name="theme-color" content="#0a0a0b" />
<!-- ... -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap"
/>
```

Also update the description meta tag:
```html
<meta name="description" content="Password Generator - Create secure diceware passphrases" />
```

- [ ] **Step 3: Update `public/manifest.json`**

```json
{
  "short_name": "Password Generator",
  "name": "Password Generator",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#0a0a0b",
  "background_color": "#0a0a0b"
}
```

- [ ] **Step 4: Verify the dev server starts and shows a dark page**

Run: `npm start` (open in browser)
Expected: Dark background, no visible content yet (components still use MUI). Fonts load. No console errors about missing fonts.

- [ ] **Step 5: Commit**

```bash
git add src/index.css public/index.html public/manifest.json
git commit -m "feat: add Terminal design system CSS and update static assets"
```

---

### Task 2: CopyButton Component

A self-contained accent pill button that handles clipboard copy and shows "Copy" → "Copied!" state transition.

**Files:**
- Create: `src/components/CopyButton.js`
- Create: `src/components/CopyButton.test.js`

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/CopyButton.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CopyButton from './CopyButton';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('renders with "Copy" text', () => {
  render(<CopyButton text="hello" />);
  expect(screen.getByLabelText('Copy passphrase to clipboard')).toBeInTheDocument();
  expect(screen.getByText('Copy')).toBeInTheDocument();
});

test('calls onCopy and shows "Copied!" on click', async () => {
  const onCopy = jest.fn().mockResolvedValue(undefined);
  render(<CopyButton text="hello" onCopy={onCopy} />);

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Copy passphrase to clipboard'));
  });

  expect(onCopy).toHaveBeenCalled();
  expect(screen.getByText('Copied!')).toBeInTheDocument();
  expect(screen.getByLabelText('Passphrase copied')).toBeInTheDocument();
});

test('reverts to "Copy" after 2 seconds', async () => {
  const onCopy = jest.fn().mockResolvedValue(undefined);
  render(<CopyButton text="hello" onCopy={onCopy} />);

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Copy passphrase to clipboard'));
  });

  expect(screen.getByText('Copied!')).toBeInTheDocument();

  act(() => { jest.advanceTimersByTime(2000); });

  expect(screen.getByText('Copy')).toBeInTheDocument();
});

test('is not rendered when text is empty', () => {
  const { container } = render(<CopyButton text="" />);
  expect(container.firstChild).toBeNull();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test --watchAll=false --testPathPattern=CopyButton`
Expected: FAIL — `CopyButton` module not found

- [ ] **Step 3: Implement CopyButton**

```jsx
// src/components/CopyButton.js
import React, { useState, useCallback, useEffect } from 'react';

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CopyButton({ text, onCopy }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleClick = useCallback(async () => {
    setCopied(true);
    try {
      if (onCopy) await onCopy();
    } catch {
      // Clipboard errors are non-fatal — visual feedback still shows
    }
  }, [onCopy]);

  if (!text) return null;

  return (
    <button
      className={`copy-btn${copied ? ' copy-btn--copied' : ''}`}
      onClick={handleClick}
      aria-label={copied ? 'Passphrase copied' : 'Copy passphrase to clipboard'}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx react-scripts test --watchAll=false --testPathPattern=CopyButton`
Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/CopyButton.js src/components/CopyButton.test.js
git commit -m "feat: add CopyButton component with copy/copied states"
```

---

### Task 3: RangeSlider Component

Custom-styled range input with label and value display.

**Files:**
- Create: `src/components/RangeSlider.js`
- Create: `src/components/RangeSlider.test.js`

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/RangeSlider.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RangeSlider from './RangeSlider';

test('renders label and current value', () => {
  render(<RangeSlider label="Min characters" value={16} min={8} max={64} onChange={() => {}} />);
  expect(screen.getByText('Min characters')).toBeInTheDocument();
  expect(screen.getByText('16')).toBeInTheDocument();
});

test('has correct aria attributes using ariaLabel prop', () => {
  render(<RangeSlider label="Min characters" ariaLabel="Minimum character length" value={20} min={8} max={64} onChange={() => {}} />);
  const input = screen.getByRole('slider');
  expect(input).toHaveAttribute('aria-label', 'Minimum character length');
  expect(input).toHaveAttribute('min', '8');
  expect(input).toHaveAttribute('max', '64');
  expect(input.value).toBe('20');
});

test('falls back to label for aria-label when ariaLabel not provided', () => {
  render(<RangeSlider label="Min characters" value={16} min={8} max={64} onChange={() => {}} />);
  const input = screen.getByRole('slider');
  expect(input).toHaveAttribute('aria-label', 'Min characters');
});

test('calls onChange when value changes', () => {
  const onChange = jest.fn();
  render(<RangeSlider label="Min" value={16} min={8} max={64} onChange={onChange} />);
  fireEvent.change(screen.getByRole('slider'), { target: { value: '24' } });
  expect(onChange).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test --watchAll=false --testPathPattern=RangeSlider`
Expected: FAIL — module not found

- [ ] **Step 3: Implement RangeSlider**

```jsx
// src/components/RangeSlider.js
import React, { useCallback, useRef, useEffect } from 'react';

export default function RangeSlider({ label, ariaLabel, value, min, max, onChange }) {
  const inputRef = useRef(null);

  // Update the CSS gradient for the filled track
  useEffect(() => {
    if (inputRef.current) {
      const pct = ((value - min) / (max - min)) * 100;
      inputRef.current.style.background = `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`;
    }
  }, [value, min, max]);

  const handleChange = useCallback(
    (e) => onChange(Number(e.target.value)),
    [onChange]
  );

  return (
    <div className="slider-group">
      <div className="slider-header">
        <span className="label">{label}</span>
        <span className="slider-value">{value}</span>
      </div>
      <input
        ref={inputRef}
        type="range"
        className="slider-input"
        value={value}
        min={min}
        max={max}
        step={1}
        onChange={handleChange}
        aria-label={ariaLabel || label}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx react-scripts test --watchAll=false --testPathPattern=RangeSlider`
Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/RangeSlider.js src/components/RangeSlider.test.js
git commit -m "feat: add RangeSlider component with accent styling"
```

---

### Task 4: GenerateButton Component

Full-width accent button with loading shimmer state.

**Files:**
- Create: `src/components/GenerateButton.js`
- Create: `src/components/GenerateButton.test.js`

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/GenerateButton.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenerateButton from './GenerateButton';

test('renders "Generate Passphrase" text', () => {
  render(<GenerateButton loading={false} onClick={() => {}} />);
  expect(screen.getByText('Generate Passphrase')).toBeInTheDocument();
});

test('shows "Generating..." when loading', () => {
  render(<GenerateButton loading={true} onClick={() => {}} />);
  expect(screen.getByText('Generating...')).toBeInTheDocument();
});

test('is disabled when loading', () => {
  render(<GenerateButton loading={true} onClick={() => {}} />);
  expect(screen.getByRole('button')).toBeDisabled();
});

test('calls onClick when clicked', () => {
  const onClick = jest.fn();
  render(<GenerateButton loading={false} onClick={onClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('does not call onClick when disabled', () => {
  const onClick = jest.fn();
  render(<GenerateButton loading={true} onClick={onClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test --watchAll=false --testPathPattern=GenerateButton`
Expected: FAIL — module not found

- [ ] **Step 3: Implement GenerateButton**

```jsx
// src/components/GenerateButton.js
import React from 'react';

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);

export default function GenerateButton({ loading, onClick }) {
  return (
    <button
      className={`generate-btn${loading ? ' generate-btn--loading' : ''}`}
      onClick={onClick}
      disabled={loading}
    >
      <RefreshIcon />
      {loading ? 'Generating...' : 'Generate Passphrase'}
    </button>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx react-scripts test --watchAll=false --testPathPattern=GenerateButton`
Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/GenerateButton.js src/components/GenerateButton.test.js
git commit -m "feat: add GenerateButton component with loading shimmer"
```

---

### Task 5: NotificationBanner Component

Inline warning/error banner with auto-dismiss.

**Files:**
- Create: `src/components/NotificationBanner.js`
- Create: `src/components/NotificationBanner.test.js`

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/NotificationBanner.test.js
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import NotificationBanner from './NotificationBanner';

beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

test('renders nothing when message is empty', () => {
  const { container } = render(<NotificationBanner message="" />);
  expect(container.firstChild).toBeNull();
});

test('renders warning message', () => {
  render(<NotificationBanner message="Showing closest result." severity="warning" />);
  expect(screen.getByText('Showing closest result.')).toBeInTheDocument();
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

test('auto-dismisses after autoDismissMs', () => {
  const onDismiss = jest.fn();
  render(
    <NotificationBanner message="Warning" severity="warning" autoDismissMs={6000} onDismiss={onDismiss} />
  );
  expect(screen.getByText('Warning')).toBeInTheDocument();

  act(() => { jest.advanceTimersByTime(6000); });

  expect(onDismiss).toHaveBeenCalled();
});

test('does not auto-dismiss when autoDismissMs is 0', () => {
  const onDismiss = jest.fn();
  render(
    <NotificationBanner message="Error" severity="error" autoDismissMs={0} onDismiss={onDismiss} />
  );

  act(() => { jest.advanceTimersByTime(10000); });

  expect(onDismiss).not.toHaveBeenCalled();
  expect(screen.getByText('Error')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test --watchAll=false --testPathPattern=NotificationBanner`
Expected: FAIL — module not found

- [ ] **Step 3: Implement NotificationBanner**

```jsx
// src/components/NotificationBanner.js
import React, { useEffect } from 'react';

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function NotificationBanner({ message, severity, autoDismissMs = 0, onDismiss }) {
  useEffect(() => {
    if (!message || !autoDismissMs || !onDismiss) return;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [message, autoDismissMs, onDismiss]);

  if (!message) return null;

  return (
    <div className="notification" role="alert">
      <WarningIcon />
      <span>{message}</span>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx react-scripts test --watchAll=false --testPathPattern=NotificationBanner`
Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/NotificationBanner.js src/components/NotificationBanner.test.js
git commit -m "feat: add NotificationBanner component with auto-dismiss"
```

---

### Task 6: PassphraseDisplay Component

The hero panel — renders passphrase words as individually animated spans, status line, and copy button.

**Files:**
- Create: `src/components/PassphraseDisplay.js`
- Create: `src/components/PassphraseDisplay.test.js`

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/PassphraseDisplay.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import PassphraseDisplay from './PassphraseDisplay';

test('shows placeholder when no password', () => {
  render(<PassphraseDisplay password="" minLength={16} maxLength={32} onCopy={() => {}} />);
  expect(screen.getByText('Click generate to create a passphrase')).toBeInTheDocument();
});

test('renders each word as a separate element', () => {
  render(<PassphraseDisplay password="alpha bravo charlie" minLength={16} maxLength={32} onCopy={() => {}} />);
  expect(screen.getByText('alpha')).toBeInTheDocument();
  expect(screen.getByText('bravo')).toBeInTheDocument();
  expect(screen.getByText('charlie')).toBeInTheDocument();
});

test('shows character count', () => {
  render(<PassphraseDisplay password="alpha bravo" minLength={8} maxLength={32} onCopy={() => {}} />);
  expect(screen.getByText('11 chars')).toBeInTheDocument();
});

test('shows "Meets range" when within constraints', () => {
  // "alpha bravo charlie" = 19 chars, within 16-32
  render(<PassphraseDisplay password="alpha bravo charlie" minLength={16} maxLength={32} onCopy={() => {}} />);
  expect(screen.getByText(/meets range/i)).toBeInTheDocument();
});

test('shows warning when below minimum', () => {
  // "hi" = 2 chars, below 16
  render(<PassphraseDisplay password="hi" minLength={16} maxLength={32} onCopy={() => {}} />);
  expect(screen.getByText(/below minimum/i)).toBeInTheDocument();
});

test('has aria-live region for passphrase', () => {
  render(<PassphraseDisplay password="test words" minLength={8} maxLength={32} onCopy={() => {}} />);
  const region = screen.getByTestId('passphrase-display');
  expect(region).toHaveAttribute('aria-live', 'polite');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test --watchAll=false --testPathPattern=PassphraseDisplay`
Expected: FAIL — module not found

- [ ] **Step 3: Implement PassphraseDisplay**

```jsx
// src/components/PassphraseDisplay.js
import React, { useState, useEffect } from 'react';
import CopyButton from './CopyButton';

export default function PassphraseDisplay({ password, minLength, maxLength, onCopy, animationKey }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!password) return;
    setAnimate(false);
    // Force a reflow so removing and re-adding the class triggers animation
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [password, animationKey]);

  const words = password ? password.split(' ') : [];
  const charCount = password.length;
  const meetsRange = charCount >= minLength && charCount <= maxLength;

  let statusMessage;
  let statusClass = '';
  if (password) {
    if (meetsRange) {
      statusMessage = 'Meets range';
      statusClass = 'status-text--success';
    } else if (charCount < minLength) {
      statusMessage = 'Below minimum';
      statusClass = 'status-text--warning';
    } else {
      statusMessage = 'Exceeds maximum';
      statusClass = 'status-text--warning';
    }
  }

  return (
    <div className="passphrase-panel">
      <div data-testid="passphrase-display" aria-live="polite">
        {password ? (
          <div className="passphrase-text">
            {words.map((word, i) => (
              <React.Fragment key={`${animationKey}-${i}`}>
                {i > 0 && ' '}
                <span className={animate ? 'passphrase-word' : ''}>
                  {word}
                </span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="passphrase-placeholder">
            Click generate to create a passphrase
          </div>
        )}
      </div>

      {password && (
        <div className="status-row">
          <span className="status-text">
            {charCount} chars
            {' '}
            <span className={statusClass}>{statusMessage}</span>
          </span>
          <CopyButton text={password} onCopy={onCopy} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx react-scripts test --watchAll=false --testPathPattern=PassphraseDisplay`
Expected: 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/PassphraseDisplay.js src/components/PassphraseDisplay.test.js
git commit -m "feat: add PassphraseDisplay hero component with word animations"
```

---

### Task 7: Rewrite App.js, Entry Point, ErrorBoundary & Tests — Atomic Migration

Replace all MUI imports with the new components across App.js, index.js, ErrorBoundary.js, and App.test.js in one atomic step. This prevents any intermediate commit from having broken tests.

**Files:**
- Rewrite: `src/App.js`
- Rewrite: `src/index.js`
- Rewrite: `src/ErrorBoundary.js`
- Rewrite: `src/App.test.js`

- [ ] **Step 1: Rewrite `src/App.js`**

```jsx
// src/App.js
import React, { useState, useCallback } from 'react';
import PassphraseDisplay from './components/PassphraseDisplay';
import RangeSlider from './components/RangeSlider';
import GenerateButton from './components/GenerateButton';
import NotificationBanner from './components/NotificationBanner';
import { getRandomWordsWithinLength } from './wordListUtils';

function App() {
  const [password, setPassword] = useState('');
  const [minLength, setMinLength] = useState(16);
  const [maxLength, setMaxLength] = useState(32);
  const [generating, setGenerating] = useState(false);
  const [notification, setNotification] = useState({ message: '', severity: 'warning', autoDismissMs: 0 });
  const [animationKey, setAnimationKey] = useState(0);

  const handleMinChange = (val) => {
    if (val <= maxLength) setMinLength(val);
  };

  const handleMaxChange = (val) => {
    if (val >= minLength) setMaxLength(val);
  };

  const generatePassword = useCallback(async () => {
    if (generating) return;
    setGenerating(true);
    setNotification({ message: '', severity: 'warning', autoDismissMs: 0 });

    try {
      const result = await getRandomWordsWithinLength(minLength, maxLength);

      if (result.success) {
        setPassword(result.password);
        setAnimationKey(k => k + 1);
      } else if (result.password) {
        setPassword(result.password);
        setAnimationKey(k => k + 1);
        setNotification({
          message: 'Could not find an exact match for your length constraints. Showing closest result.',
          severity: 'warning',
          autoDismissMs: 6000,
        });
      } else {
        setNotification({
          message: 'Could not generate a passphrase with these constraints. Try widening the length range.',
          severity: 'error',
          autoDismissMs: 0,
        });
      }
    } catch (err) {
      setNotification({
        message: 'Failed to generate password. Please try again.',
        severity: 'error',
        autoDismissMs: 0,
      });
    } finally {
      setGenerating(false);
    }
  }, [minLength, maxLength, generating]);

  const copyToClipboard = useCallback(async () => {
    if (!password) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(password);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      // Clipboard write failed — CopyButton will still show "Copied!" visually
    }
  }, [password]);

  return (
    <main className="app-container app-fade-in">
      <h1 className="app-title">Password Generator</h1>
      <p className="app-tagline">Secure diceware passphrases, generated locally.</p>

      <PassphraseDisplay
        password={password}
        minLength={minLength}
        maxLength={maxLength}
        onCopy={copyToClipboard}
        animationKey={animationKey}
      />

      <NotificationBanner
        message={notification.message}
        severity={notification.severity}
        autoDismissMs={notification.autoDismissMs}
        onDismiss={() => setNotification({ message: '', severity: 'warning', autoDismissMs: 0 })}
      />

      <RangeSlider
        label="Min characters"
        ariaLabel="Minimum character length"
        value={minLength}
        min={8}
        max={64}
        onChange={handleMinChange}
      />

      <RangeSlider
        label="Max characters"
        ariaLabel="Maximum character length"
        value={maxLength}
        min={8}
        max={64}
        onChange={handleMaxChange}
      />

      <GenerateButton loading={generating} onClick={generatePassword} />

      <p className="trust-footer">Generated locally. Never stored or transmitted.</p>
    </main>
  );
}

export default App;
```

- [ ] **Step 2: Rewrite `src/index.js`**

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

- [ ] **Step 3: Rewrite `src/ErrorBoundary.js`**

```jsx
// src/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1 className="error-title">Something went wrong</h1>
          <p className="error-message">
            The application encountered an unexpected error.
          </p>
          <button
            className="error-btn"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

- [ ] **Step 4: Rewrite `src/App.test.js`**

```jsx
// src/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';
import * as wordListUtils from './wordListUtils';

const renderApp = () => render(<App />);

beforeEach(() => {
  jest.restoreAllMocks();
  wordListUtils.clearWordListCache();
});

// =========================================================================
// 1. INITIAL RENDER
// =========================================================================
describe('Initial render', () => {
  test('renders the heading', () => {
    renderApp();
    expect(screen.getByText('Password Generator')).toBeInTheDocument();
  });

  test('renders the generate button', () => {
    renderApp();
    expect(screen.getByText('Generate Passphrase')).toBeInTheDocument();
  });

  test('shows placeholder before first generate', () => {
    renderApp();
    expect(screen.getByText('Click generate to create a passphrase')).toBeInTheDocument();
  });

  test('renders min and max sliders', () => {
    renderApp();
    expect(screen.getByText('Min characters')).toBeInTheDocument();
    expect(screen.getByText('Max characters')).toBeInTheDocument();
  });
});

// =========================================================================
// 2. PASSWORD GENERATION
// =========================================================================
describe('Password generation', () => {
  test('displays generated password after clicking button', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: ['alpha', 'bravo', 'charlie'],
      password: 'alpha bravo charlie',
      success: true,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Passphrase'));

    await waitFor(() => {
      expect(screen.getByText('alpha')).toBeInTheDocument();
      expect(screen.getByText('bravo')).toBeInTheDocument();
      expect(screen.getByText('charlie')).toBeInTheDocument();
    });
  });

  test('shows warning when generation returns success: false with password', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: ['short'],
      password: 'short',
      success: false,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Passphrase'));

    await waitFor(() => {
      expect(screen.getByText(/closest result/i)).toBeInTheDocument();
    });
  });

  test('shows error when generation returns no password', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: [],
      password: '',
      success: false,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Passphrase'));

    await waitFor(() => {
      expect(screen.getByText(/widening the length range/i)).toBeInTheDocument();
    });
  });

  test('shows error when generation throws', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockRejectedValue(
      new Error('Network failure')
    );

    renderApp();
    fireEvent.click(screen.getByText('Generate Passphrase'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to generate password/i)).toBeInTheDocument();
    });
  });

  test('button is disabled while generating', async () => {
    let resolveGeneration;
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockImplementation(
      () => new Promise(resolve => { resolveGeneration = resolve; })
    );

    renderApp();
    fireEvent.click(screen.getByText('Generate Passphrase'));

    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });
    expect(screen.getByText('Generating...').closest('button')).toBeDisabled();

    await act(async () => {
      resolveGeneration({
        words: ['test', 'word'],
        password: 'test word',
        success: true,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Generate Passphrase')).toBeInTheDocument();
    });
  });
});

// =========================================================================
// 3. COPY TO CLIPBOARD
// =========================================================================
describe('Copy to clipboard', () => {
  test('copies password to clipboard and shows Copied state', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: ['delta', 'echo', 'foxtrot'],
      password: 'delta echo foxtrot',
      success: true,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Passphrase'));

    await waitFor(() => {
      expect(screen.getByText('delta')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Copy passphrase to clipboard'));
    });

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
    expect(writeText).toHaveBeenCalledWith('delta echo foxtrot');
  });
});

// =========================================================================
// 4. CHARACTER COUNT DISPLAY
// =========================================================================
describe('Character count display', () => {
  test('shows character count after generation', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: ['alpha', 'bravo'],
      password: 'alpha bravo', // 11 chars
      success: true,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Passphrase'));

    await waitFor(() => {
      expect(screen.getByText('11 chars')).toBeInTheDocument();
    });
  });

  test('shows "Meets range" when within range', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: ['alpha', 'bravo', 'charlie'],
      password: 'alpha bravo charlie', // 19 chars, default min=16, max=32
      success: true,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Passphrase'));

    await waitFor(() => {
      expect(screen.getByText(/meets range/i)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 5: Run all tests**

Run: `npx react-scripts test --watchAll=false`
Expected: ALL tests pass (App.test.js, CopyButton.test.js, RangeSlider.test.js, GenerateButton.test.js, NotificationBanner.test.js, PassphraseDisplay.test.js, wordListUtils.test.js)

- [ ] **Step 6: Verify the app renders in the browser**

Run: `npm start` (open in browser)
Expected: Dark theme, all components visible, generate and copy work. No MUI imports anywhere. No console errors.

- [ ] **Step 7: Commit**

```bash
git add src/App.js src/index.js src/ErrorBoundary.js src/App.test.js
git commit -m "feat: rewrite App, entry point, ErrorBoundary and tests — drop MUI"
```

---

### Task 8: Remove MUI Dependencies

Uninstall all Material UI and Emotion packages.

**Files:**
- Modify: `package.json` (via npm uninstall)

- [ ] **Step 1: Uninstall MUI packages**

Run: `npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled`
Expected: Packages removed from `package.json` and `node_modules`

- [ ] **Step 2: Verify no MUI imports remain in source**

Run: `grep -r "@mui\|@emotion" src/`
Expected: No output (no matches)

- [ ] **Step 3: Run all tests again**

Run: `npx react-scripts test --watchAll=false`
Expected: ALL tests pass

- [ ] **Step 4: Verify dev server works**

Run: `npm start` (open in browser)
Expected: App loads fully styled, no console errors. Dark theme, cyan accent, monospace passphrase, animations work.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove MUI and Emotion dependencies"
```

---

### Task 9: Final Verification & Cleanup

Verify everything works end-to-end and the build succeeds.

**Files:**
- None created or modified — verification only

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no warnings about missing modules

- [ ] **Step 2: Run all tests one final time**

Run: `npx react-scripts test --watchAll=false`
Expected: ALL tests pass

- [ ] **Step 3: Manual verification checklist**

Open `npm start` in browser and verify:
- Dark background (`#0a0a0b`)
- Inter font on UI text, JetBrains Mono on passphrase
- Generate button has cyan accent, glow on hover, shimmer while loading
- Passphrase words animate in with stagger
- Copy button shows "Copy" → "Copied!" with pulse
- Sliders have cyan thumb and filled track
- Notification banner appears for constraint warnings
- Tab navigation works in correct order
- Focus rings are cyan
- `prefers-reduced-motion` disables animations (test in browser DevTools)
- No console errors

- [ ] **Step 4: Update CLAUDE.md file map**

Add the new component files to the file map section in `CLAUDE.md`:

```markdown
src/components/CopyButton.js - Accent pill button with copy/copied states, inline SVG icons
src/components/RangeSlider.js - Custom range slider with accent track fill and value label
src/components/GenerateButton.js - Full-width accent button with loading shimmer state
src/components/NotificationBanner.js - Inline warning/error banner with auto-dismiss
src/components/PassphraseDisplay.js - Hero panel: passphrase word spans, status line, copy button
```

Also update the Architecture section to reflect the MUI removal and new component structure.

- [ ] **Step 5: Commit any final tweaks**

```bash
git add -A
git commit -m "feat: complete Terminal visual redesign"
```
