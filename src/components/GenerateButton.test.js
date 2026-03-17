import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenerateButton from './GenerateButton';

test('renders "Generate Passphrase" text', () => {
  render(<GenerateButton loading={false} onClick={() => {}} />);
  expect(screen.getByText('Generate Passphrase')).toBeInTheDocument();
});

test('shows "Generating..." when loading', () => {
  render(<GenerateButton loading={true} onClick={() => {}} />);
  expect(screen.getByText('Generating...')).toBeInTheDocument();
});

test('is disabled when loading', () => {
  render(<GenerateButton loading={true} onClick={() => {}} />);
  expect(screen.getByRole('button')).toBeDisabled();
});

test('calls onClick when clicked', () => {
  const onClick = jest.fn();
  render(<GenerateButton loading={false} onClick={onClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('does not call onClick when disabled', () => {
  const onClick = jest.fn();
  render(<GenerateButton loading={true} onClick={onClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).not.toHaveBeenCalled();
});
