import {
  getRandomWord,
  getRandomWords,
  getRandomWordsWithinLength,
  clearWordListCache,
} from './wordListUtils';

// --- Test helpers ---

// A small deterministic wordlist for predictable testing
const MOCK_WORDLIST = [
  'apple', 'grape', 'lemon', 'mango', 'peach',  // 5 chars each
  'banana', 'cherry', 'orange',                    // 6 chars each
  'coconut', 'avocado',                            // 7 chars each
  'blueberry', 'raspberry',                        // 9 chars each
  'strawberry',                                     // 10 chars
  'watermelon',                                     // 10 chars
].join('\n');

const REAL_WORDLIST_URL = '/wordlist.txt';
let realWordlistContent = null;

/**
 * Mock fetch to return a wordlist string.
 */
const mockFetch = (content) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve(content),
    })
  );
};

const mockFetchFailure = (status = 500) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status,
      text: () => Promise.resolve(''),
    })
  );
};

const mockFetchNetworkError = () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
};

beforeEach(() => {
  clearWordListCache();
  jest.restoreAllMocks();
});

// =========================================================================
// 1. CRYPTOGRAPHIC RANDOMNESS
// =========================================================================
describe('Cryptographic randomness', () => {
  test('uses crypto.getRandomValues, not Math.random', async () => {
    mockFetch(MOCK_WORDLIST);
    const mathRandomSpy = jest.spyOn(Math, 'random');
    const cryptoSpy = jest.spyOn(window.crypto, 'getRandomValues');

    await getRandomWord();

    expect(cryptoSpy).toHaveBeenCalled();
    expect(mathRandomSpy).not.toHaveBeenCalled();
  });
});

// =========================================================================
// 2. SINGLE WORD GENERATION
// =========================================================================
describe('getRandomWord', () => {
  test('returns a word from the wordlist', async () => {
    mockFetch(MOCK_WORDLIST);
    const words = MOCK_WORDLIST.split('\n').map(w => w.trim().toLowerCase()).filter(Boolean);
    const word = await getRandomWord();
    expect(words).toContain(word);
  });

  test('returns a lowercase string', async () => {
    mockFetch(MOCK_WORDLIST);
    const word = await getRandomWord();
    expect(word).toBe(word.toLowerCase());
    expect(word.length).toBeGreaterThan(0);
  });

  test('caches the wordlist across calls (only one fetch)', async () => {
    mockFetch(MOCK_WORDLIST);
    await getRandomWord();
    await getRandomWord();
    await getRandomWord();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('throws on fetch failure', async () => {
    mockFetchFailure(404);
    await expect(getRandomWord()).rejects.toThrow('Failed to fetch word list');
  });

  test('throws on network error', async () => {
    mockFetchNetworkError();
    await expect(getRandomWord()).rejects.toThrow('Network error');
  });
});

// =========================================================================
// 3. MULTIPLE WORD GENERATION
// =========================================================================
describe('getRandomWords', () => {
  test('returns the requested number of words', async () => {
    mockFetch(MOCK_WORDLIST);
    const words = await getRandomWords(4);
    expect(words).toHaveLength(4);
  });

  test('all returned words are unique (no duplicates)', async () => {
    mockFetch(MOCK_WORDLIST);
    // Run multiple times to increase confidence
    for (let i = 0; i < 20; i++) {
      clearWordListCache();
      mockFetch(MOCK_WORDLIST);
      const words = await getRandomWords(5);
      const unique = new Set(words);
      expect(unique.size).toBe(words.length);
    }
  });

  test('all returned words exist in the wordlist', async () => {
    mockFetch(MOCK_WORDLIST);
    const valid = new Set(MOCK_WORDLIST.split('\n').map(w => w.trim().toLowerCase()).filter(Boolean));
    const words = await getRandomWords(5);
    words.forEach(w => expect(valid.has(w)).toBe(true));
  });

  test('throws when requesting more words than available', async () => {
    mockFetch(MOCK_WORDLIST);
    const wordCount = new Set(MOCK_WORDLIST.split('\n').map(w => w.trim()).filter(Boolean)).size;
    await expect(getRandomWords(wordCount + 1)).rejects.toThrow();
  });

  test('defaults to 3 words when count not specified', async () => {
    mockFetch(MOCK_WORDLIST);
    const words = await getRandomWords();
    expect(words).toHaveLength(3);
  });
});

// =========================================================================
// 4. PASSPHRASE LENGTH CONSTRAINTS
// =========================================================================
describe('getRandomWordsWithinLength', () => {
  test('generates password within specified min/max range', async () => {
    mockFetch(MOCK_WORDLIST);
    // Range that should easily accommodate 3 five-letter words: "apple grape lemon" = 17 chars
    const result = await getRandomWordsWithinLength(12, 25);
    expect(result.success).toBe(true);
    expect(result.password.length).toBeGreaterThanOrEqual(12);
    expect(result.password.length).toBeLessThanOrEqual(25);
  });

  test('words are joined by spaces', async () => {
    mockFetch(MOCK_WORDLIST);
    const result = await getRandomWordsWithinLength(10, 40);
    expect(result.success).toBe(true);
    expect(result.password).toContain(' ');
    expect(result.words.join(' ')).toBe(result.password);
  });

  test('returns success: false for impossible constraints (range too narrow)', async () => {
    mockFetch(MOCK_WORDLIST);
    // min=8, max=8: impossible for any multi-word passphrase with 4+ char words
    const result = await getRandomWordsWithinLength(8, 8);
    expect(result.success).toBe(false);
  });

  test('returns success: false when minLength > maxLength', async () => {
    mockFetch(MOCK_WORDLIST);
    const result = await getRandomWordsWithinLength(30, 10);
    expect(result.success).toBe(false);
  });

  test('handles wide range successfully', async () => {
    mockFetch(MOCK_WORDLIST);
    const result = await getRandomWordsWithinLength(10, 64);
    expect(result.success).toBe(true);
    expect(result.words.length).toBeGreaterThanOrEqual(2);
  });

  test('generates at least 2 words minimum', async () => {
    mockFetch(MOCK_WORDLIST);
    const result = await getRandomWordsWithinLength(10, 64);
    if (result.success) {
      expect(result.words.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('never generates more than 6 words', async () => {
    mockFetch(MOCK_WORDLIST);
    // Very large range that could tempt the algorithm to use many words
    const result = await getRandomWordsWithinLength(40, 64);
    if (result.success) {
      expect(result.words.length).toBeLessThanOrEqual(6);
    }
  });

  test('consistency: running multiple times always produces valid results for reasonable range', async () => {
    mockFetch(MOCK_WORDLIST);
    const failures = [];
    for (let i = 0; i < 30; i++) {
      clearWordListCache();
      mockFetch(MOCK_WORDLIST);
      const result = await getRandomWordsWithinLength(12, 40);
      if (!result.success) failures.push(result);
    }
    // With a reasonable range, failures should be very rare
    expect(failures.length).toBeLessThanOrEqual(2);
  });
});

// =========================================================================
// 5. WORDLIST INTEGRITY (runs against real wordlist.txt)
// =========================================================================
describe('Wordlist integrity', () => {
  // These tests verify the actual wordlist.txt file is well-formed.
  // They use a real fetch mock that returns the actual file content.

  const loadRealWordlist = () => {
    // Read the actual wordlist from the filesystem for integrity checks
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(
      path.join(__dirname, '..', 'public', 'wordlist.txt'),
      'utf-8'
    );
    return content;
  };

  test('all entries are lowercase alphabetic only', () => {
    const content = loadRealWordlist();
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const nonAlpha = lines.filter(l => !/^[a-z]+$/.test(l.trim()));
    expect(nonAlpha).toEqual([]);
  });

  test('no duplicate entries', () => {
    const content = loadRealWordlist();
    const words = content.split('\n').map(l => l.trim()).filter(Boolean);
    const unique = new Set(words);
    expect(unique.size).toBe(words.length);
  });

  test('no empty lines (except possibly trailing)', () => {
    const content = loadRealWordlist();
    const lines = content.split('\n');
    // Remove the last line if it's empty (trailing newline is OK)
    if (lines[lines.length - 1] === '') lines.pop();
    const emptyLines = lines.filter(l => l.trim() === '');
    expect(emptyLines).toEqual([]);
  });

  test('has a reasonable number of words (> 2000)', () => {
    const content = loadRealWordlist();
    const words = content.split('\n').map(l => l.trim()).filter(Boolean);
    expect(words.length).toBeGreaterThan(2000);
  });

  test('no words shorter than 2 characters', () => {
    const content = loadRealWordlist();
    const words = content.split('\n').map(l => l.trim()).filter(Boolean);
    const tooShort = words.filter(w => w.length < 2);
    expect(tooShort).toEqual([]);
  });
});

// =========================================================================
// 6. CACHING BEHAVIOUR
// =========================================================================
describe('Wordlist caching', () => {
  test('clearWordListCache forces a re-fetch', async () => {
    mockFetch(MOCK_WORDLIST);
    await getRandomWord();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    clearWordListCache();
    mockFetch(MOCK_WORDLIST);
    await getRandomWord();
    expect(global.fetch).toHaveBeenCalledTimes(1); // new mock, called once
  });

  test('filters out non-alphabetic entries from wordlist', async () => {
    const dirtyList = 'apple\nTRUE\ngrape123\nbanana\ne-mail\n\nmango';
    mockFetch(dirtyList);
    const words = await getRandomWords(3);
    // Should only contain: apple, true, banana, mango (true is alpha after lowercase)
    words.forEach(w => {
      expect(w).toMatch(/^[a-z]+$/);
    });
  });

  test('deduplicates words in the wordlist', async () => {
    const dupeList = 'apple\nbanana\napple\ncherry\nbanana\ngrape';
    mockFetch(dupeList);
    // If deduplication works, we should have exactly 4 unique words
    // Requesting 4 should work, requesting 5 should fail
    const words = await getRandomWords(4);
    expect(new Set(words).size).toBe(4);
    clearWordListCache();
    mockFetch(dupeList);
    await expect(getRandomWords(5)).rejects.toThrow();
  });

  test('throws when wordlist is empty after filtering', async () => {
    mockFetch('123\n@#$\n---');
    await expect(getRandomWord()).rejects.toThrow('Word list is empty');
  });
});

// =========================================================================
// 7. EDGE CASES
// =========================================================================
describe('Edge cases', () => {
  test('handles wordlist with only one word', async () => {
    mockFetch('hello');
    const word = await getRandomWord();
    expect(word).toBe('hello');
  });

  test('getRandomWords with count=1 returns single-element array', async () => {
    mockFetch(MOCK_WORDLIST);
    const words = await getRandomWords(1);
    expect(words).toHaveLength(1);
  });

  test('getRandomWords with count=0 returns empty array', async () => {
    mockFetch(MOCK_WORDLIST);
    const words = await getRandomWords(0);
    expect(words).toHaveLength(0);
  });

  test('password with tight constraints still contains only wordlist words', async () => {
    mockFetch(MOCK_WORDLIST);
    const result = await getRandomWordsWithinLength(11, 15);
    if (result.success) {
      const valid = new Set(MOCK_WORDLIST.split('\n').map(w => w.trim().toLowerCase()).filter(Boolean));
      result.words.forEach(w => expect(valid.has(w)).toBe(true));
    }
  });
});
