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

test('shows warning when exceeds maximum', () => {
  // "alpha bravo charlie delta echo" = 30 chars, exceeds max of 10
  render(<PassphraseDisplay password="alpha bravo charlie delta echo" minLength={8} maxLength={10} onCopy={() => {}} />);
  expect(screen.getByText(/exceeds maximum/i)).toBeInTheDocument();
});

test('has aria-live region for passphrase', () => {
  render(<PassphraseDisplay password="test words" minLength={8} maxLength={32} onCopy={() => {}} />);
  const region = screen.getByTestId('passphrase-display');
  expect(region).toHaveAttribute('aria-live', 'polite');
});
