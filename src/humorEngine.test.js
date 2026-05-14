import { generateFunnyPassphrase } from './humorEngine';

describe('generateFunnyPassphrase', () => {
  test('returns words from humor engine categories', () => {
    const result = generateFunnyPassphrase(10, 60);
    expect(result.words.length).toBeGreaterThanOrEqual(2);
    expect(result.password).toBe(result.words.join(' '));
  });

  test('uses crypto.getRandomValues, not Math.random', () => {
    const mathRandomSpy = vi.spyOn(Math, 'random');
    const cryptoSpy = vi.spyOn(window.crypto, 'getRandomValues');

    generateFunnyPassphrase(10, 60);

    expect(cryptoSpy).toHaveBeenCalled();
    expect(mathRandomSpy).not.toHaveBeenCalled();

    mathRandomSpy.mockRestore();
    cryptoSpy.mockRestore();
  });

  test('respects min/max length constraints when possible', () => {
    const result = generateFunnyPassphrase(15, 30, 500);
    if (result.success) {
      expect(result.password.length).toBeGreaterThanOrEqual(15);
      expect(result.password.length).toBeLessThanOrEqual(30);
    }
  });

  test('returns success: false for impossible constraints', () => {
    const result = generateFunnyPassphrase(1, 2, 50);
    expect(result.success).toBe(false);
  });

  test('returns all lowercase words', () => {
    const result = generateFunnyPassphrase(10, 60);
    result.words.forEach(word => {
      expect(word).toBe(word.toLowerCase());
      expect(word).toMatch(/^[a-z]+$/);
    });
  });

  test('generates at least 2 words', () => {
    for (let i = 0; i < 20; i++) {
      const result = generateFunnyPassphrase(10, 60);
      expect(result.words.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('consistency: reasonable range succeeds most of the time', () => {
    let successes = 0;
    for (let i = 0; i < 30; i++) {
      const result = generateFunnyPassphrase(12, 40, 200);
      if (result.success) successes++;
    }
    expect(successes).toBeGreaterThanOrEqual(25);
  });

  test('returns a result object even on failure', () => {
    const result = generateFunnyPassphrase(1, 2, 5);
    expect(result).toHaveProperty('words');
    expect(result).toHaveProperty('password');
    expect(result).toHaveProperty('success');
  });
});
