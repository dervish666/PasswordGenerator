// Utility functions for working with the word list text file

const TOTAL_WORDS = 3815; // Total number of words in wordlist.txt

/**
 * Fetches a random word from the wordlist.txt file by reading a specific line
 * @returns {Promise<string>} A random word from the list
 */
export const getRandomWord = async () => {
  try {
    // Generate a random line number (1-based indexing)
    const randomLineNumber = Math.floor(Math.random() * TOTAL_WORDS) + 1;
    
    // Fetch the entire file
    const response = await fetch('/wordlist.txt');
    if (!response.ok) {
      throw new Error('Failed to fetch word list');
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    // Get the word at the random line (convert to 0-based indexing)
    const word = lines[randomLineNumber - 1]?.trim();
    
    if (!word) {
      throw new Error('Invalid word retrieved');
    }
    
    return word.toLowerCase();
  } catch (error) {
    console.error('Error fetching random word:', error);
    // Fallback to a default word if there's an error
    return 'password';
  }
};

/**
 * Generates multiple random words from the word list
 * @param {number} count - Number of words to generate
 * @returns {Promise<string[]>} Array of random words
 */
export const getRandomWords = async (count = 3) => {
  const words = [];
  
  // Generate multiple random words
  for (let i = 0; i < count; i++) {
    const word = await getRandomWord();
    words.push(word);
  }
  
  return words;
};

/**
 * More efficient version that fetches the file once and selects multiple random lines
 * @param {number} count - Number of words to generate
 * @returns {Promise<string[]>} Array of random words
 */
export const getRandomWordsEfficient = async (count = 3) => {
  try {
    // Fetch the entire file once
    const response = await fetch('/wordlist.txt');
    if (!response.ok) {
      throw new Error('Failed to fetch word list');
    }
    
    const text = await response.text();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const words = [];
    const usedIndices = new Set();
    
    // Generate unique random words
    while (words.length < count && usedIndices.size < lines.length) {
      const randomIndex = Math.floor(Math.random() * lines.length);
      
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const word = lines[randomIndex];
        if (word) {
          words.push(word.toLowerCase());
        }
      }
    }
    
    return words;
  } catch (error) {
    console.error('Error fetching random words:', error);
    // Fallback to default words if there's an error
    return ['secure', 'password', 'generator'].slice(0, count);
  }
};

/**
 * Generates a passphrase within specified character length constraints
 * @param {number} minLength - Minimum total character length (including spaces)
 * @param {number} maxLength - Maximum total character length (including spaces)
 * @param {number} maxAttempts - Maximum number of attempts before giving up
 * @returns {Promise<{words: string[], password: string, success: boolean}>} Result object
 */
export const getRandomWordsWithinLength = async (minLength = 16, maxLength = 32, maxAttempts = 100) => {
  try {
    // Fetch the entire file once
    const response = await fetch('/wordlist.txt');
    if (!response.ok) {
      throw new Error('Failed to fetch word list');
    }
    
    const text = await response.text();
    const allWords = text.split('\n').map(line => line.trim().toLowerCase()).filter(line => line.length > 0);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const words = [];
      const usedIndices = new Set();
      
      // Start with 3 words and adjust as needed
      let targetWordCount = 3;
      
      // Generate unique random words
      while (words.length < targetWordCount && usedIndices.size < allWords.length) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          const word = allWords[randomIndex];
          if (word) {
            words.push(word);
          }
        }
      }
      
      // Calculate password length (words joined by spaces)
      const password = words.join(' ');
      const passwordLength = password.length;
      
      // Check if within constraints
      if (passwordLength >= minLength && passwordLength <= maxLength) {
        return { words, password, success: true };
      }
      
      // Adjust word count for next attempt based on current length
      if (passwordLength < minLength) {
        targetWordCount = Math.min(targetWordCount + 1, 6); // Try more words
      } else if (passwordLength > maxLength) {
        targetWordCount = Math.max(targetWordCount - 1, 2); // Try fewer words
      }
    }
    
    // If we couldn't find a valid combination, return the last attempt with success: false
    const fallbackWords = await getRandomWordsEfficient(3);
    return {
      words: fallbackWords,
      password: fallbackWords.join(' '),
      success: false
    };
  } catch (error) {
    console.error('Error generating password within length constraints:', error);
    const fallbackWords = ['secure', 'password', 'generator'];
    return {
      words: fallbackWords,
      password: fallbackWords.join(' '),
      success: false
    };
  }
};