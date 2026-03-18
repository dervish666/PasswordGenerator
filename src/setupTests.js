import '@testing-library/jest-dom';

// Polyfill crypto.getRandomValues for the jsdom test environment
if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
  const { Crypto } = await import('@peculiar/webcrypto');
  const cryptoInstance = new Crypto();
  Object.defineProperty(globalThis, 'crypto', {
    value: cryptoInstance,
    writable: true,
    configurable: true,
  });
}
