// Utility functions for working with the word list text file

// In-memory cache for the wordlist to avoid repeated HTTP fetches
let cachedWordList = null;
let cachedWordStats = null;

/**
 * Returns a cryptographically secure random integer in [0, max)
 * Uses crypto.getRandomValues() instead of Math.random() for security.
 * @param {number} max - Exclusive upper bound
 * @returns {number} Random integer
 */
const secureRandomInt = (max) => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  // Use modulo with rejection sampling to avoid bias
  // For our wordlist sizes (< 10000), the bias from simple modulo on a 32-bit
  // range is negligible (< 0.0001%), but we do it correctly anyway.
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  let value = array[0];
  while (value >= limit) {
    window.crypto.getRandomValues(array);
    value = array[0];
  }
  return value % max;
};

/**
 * Fetches and caches the wordlist. Deduplicates and normalises entries.
 * @returns {Promise<string[]>} Array of unique, lowercase words
 */
const getWordList = async () => {
  if (cachedWordList) {
    return cachedWordList;
  }

  const response = await fetch('/wordlist.txt');
  if (!response.ok) {
    throw new Error(`Failed to fetch word list: ${response.status}`);
  }

  const text = await response.text();
  const seen = new Set();
  const words = [];

  for (const raw of text.split('\n')) {
    const word = raw.trim().toLowerCase();
    // Skip empty lines, non-alphabetic entries, and duplicates
    if (word.length > 0 && /^[a-z]+$/.test(word) && !seen.has(word)) {
      seen.add(word);
      words.push(word);
    }
  }

  if (words.length === 0) {
    throw new Error('Word list is empty after filtering');
  }

  cachedWordList = words;
  cachedWordStats = {
    shortest: Math.min(...words.map(w => w.length)),
    longest: Math.max(...words.map(w => w.length)),
    avg: words.reduce((sum, w) => sum + w.length, 0) / words.length,
  };
  return words;
};

/**
 * Clears the cached wordlist (useful for testing)
 */
export const clearWordListCache = () => {
  cachedWordList = null;
  cachedWordStats = null;
};

/**
 * Fetches a single random word from the wordlist
 * @returns {Promise<string>} A random word from the list
 */
export const getRandomWord = async () => {
  const words = await getWordList();
  return words[secureRandomInt(words.length)];
};

/**
 * Generates multiple unique random words from the word list.
 * Fetches the file once and selects from it.
 * @param {number} count - Number of words to generate
 * @returns {Promise<string[]>} Array of unique random words
 */
export const getRandomWords = async (count = 3) => {
  const allWords = await getWordList();

  if (count > allWords.length) {
    throw new Error(`Requested ${count} words but only ${allWords.length} available`);
  }

  // Fisher-Yates partial shuffle for unbiased selection
  const indices = Array.from({ length: allWords.length }, (_, i) => i);
  for (let i = 0; i < count; i++) {
    const j = i + secureRandomInt(indices.length - i);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, count).map(i => allWords[i]);
};

/**
 * Generates a passphrase within specified character length constraints.
 *
 * Strategy: tries different word counts (2-6), picking random words each
 * attempt, and returns the first combination that fits within the
 * [minLength, maxLength] range (inclusive, counting spaces).
 *
 * @param {number} minLength - Minimum total character length (including spaces)
 * @param {number} maxLength - Maximum total character length (including spaces)
 * @param {number} maxAttempts - Maximum number of attempts before giving up
 * @returns {Promise<{words: string[], password: string, success: boolean}>} Result object
 */
export const getRandomWordsWithinLength = async (minLength = 16, maxLength = 32, maxAttempts = 100) => {
  if (minLength > maxLength) {
    return { words: [], password: '', success: false };
  }

  const allWords = await getWordList();
  const { shortest: shortestWordLen, longest: longestWordLen, avg: avgWordLen } = cachedWordStats;
  const targetLen = (minLength + maxLength) / 2;
  let targetWordCount = Math.max(2, Math.min(6, Math.round(targetLen / (avgWordLen + 1))));

  let bestResult = null;
  let bestDistance = Infinity;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Clamp word count to feasible range
    const wordCount = Math.max(2, Math.min(6, targetWordCount));

    if (wordCount > allWords.length) break;

    const words = await getRandomWords(wordCount);
    const password = words.join(' ');
    const len = password.length;

    if (len >= minLength && len <= maxLength) {
      return { words, password, success: true };
    }

    // Track the closest result as fallback
    const distance = len < minLength ? minLength - len : len - maxLength;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestResult = { words, password, success: false };
    }

    // Adjust word count for next attempt
    if (len < minLength) {
      // Check if adding a word is feasible
      const minPossibleWithMore = wordCount * (shortestWordLen + 1) + shortestWordLen;
      if (minPossibleWithMore <= maxLength) {
        targetWordCount = wordCount + 1;
      }
      // Otherwise keep same count and hope for longer words
    } else {
      // Too long - check if fewer words could work
      const maxPossibleWithFewer = (wordCount - 2) * (longestWordLen + 1) + longestWordLen;
      if (maxPossibleWithFewer >= minLength || wordCount > 2) {
        targetWordCount = wordCount - 1;
      }
    }
  }

  // Return the closest result we found
  return bestResult || { words: [], password: '', success: false };
};
