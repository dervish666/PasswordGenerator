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