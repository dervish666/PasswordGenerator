import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';
import * as wordListUtils from './wordListUtils';

const renderApp = () => render(<App />);

beforeEach(() => {
  vi.restoreAllMocks();
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
    vi.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
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
    vi.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
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
    vi.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
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
    vi.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockRejectedValue(
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
    vi.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockImplementation(
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
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    vi.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
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
    vi.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
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
    vi.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
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
