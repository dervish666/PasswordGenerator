// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill crypto.getRandomValues for the Jest/jsdom test environment
const { Crypto } = require('@peculiar/webcrypto');

if (!window.crypto || !window.crypto.getRandomValues) {
  const cryptoInstance = new Crypto();
  Object.defineProperty(window, 'crypto', {
    value: cryptoInstance,
    writable: true,
    configurable: true,
  });
}
