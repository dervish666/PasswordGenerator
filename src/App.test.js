import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import * as wordListUtils from './wordListUtils';

const theme = createTheme();

const renderApp = () =>
  render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );

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
    expect(screen.getByText('Generate Password')).toBeInTheDocument();
  });

  test('does not show a password initially', () => {
    renderApp();
    expect(screen.queryByText('Your generated password:')).not.toBeInTheDocument();
  });

  test('renders min and max sliders', () => {
    renderApp();
    expect(screen.getByText(/Minimum Characters/)).toBeInTheDocument();
    expect(screen.getByText(/Maximum Characters/)).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('Generate Password'));

    await waitFor(() => {
      expect(screen.getByText('Your generated password:')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('alpha bravo charlie')).toBeInTheDocument();
  });

  test('shows warning when generation returns success: false with password', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: ['short'],
      password: 'short',
      success: false,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Password'));

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
    fireEvent.click(screen.getByText('Generate Password'));

    await waitFor(() => {
      expect(screen.getByText(/widening the length range/i)).toBeInTheDocument();
    });
  });

  test('shows error when generation throws', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockRejectedValue(
      new Error('Network failure')
    );

    renderApp();
    fireEvent.click(screen.getByText('Generate Password'));

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
    fireEvent.click(screen.getByText('Generate Password'));

    // Button should show "Generating..." and be disabled
    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });
    expect(screen.getByText('Generating...').closest('button')).toBeDisabled();

    // Resolve the generation
    await act(async () => {
      resolveGeneration({
        words: ['test', 'word'],
        password: 'test word',
        success: true,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Generate Password')).toBeInTheDocument();
    });
  });
});

// =========================================================================
// 3. COPY TO CLIPBOARD
// =========================================================================
describe('Copy to clipboard', () => {
  test('copies password to clipboard and shows success notification', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: ['copy', 'this', 'text'],
      password: 'copy this text',
      success: true,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Password'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('copy this text')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('copy to clipboard'));

    await waitFor(() => {
      expect(screen.getByText('Password copied to clipboard!')).toBeInTheDocument();
    });
    expect(writeText).toHaveBeenCalledWith('copy this text');
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
    fireEvent.click(screen.getByText('Generate Password'));

    await waitFor(() => {
      expect(screen.getByText('Character count: 11')).toBeInTheDocument();
    });
  });

  test('shows "Meets length requirements" when within range', async () => {
    jest.spyOn(wordListUtils, 'getRandomWordsWithinLength').mockResolvedValue({
      words: ['alpha', 'bravo', 'charlie'],
      password: 'alpha bravo charlie', // 19 chars, default min=16, max=32
      success: true,
    });

    renderApp();
    fireEvent.click(screen.getByText('Generate Password'));

    await waitFor(() => {
      expect(screen.getByText('Meets length requirements')).toBeInTheDocument();
    });
  });
});
