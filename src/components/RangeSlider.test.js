import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RangeSlider from './RangeSlider';

test('renders label and current value', () => {
  render(<RangeSlider label="Min characters" value={16} min={8} max={64} onChange={() => {}} />);
  expect(screen.getByText('Min characters')).toBeInTheDocument();
  expect(screen.getByText('16')).toBeInTheDocument();
});

test('has correct aria attributes using ariaLabel prop', () => {
  render(<RangeSlider label="Min characters" ariaLabel="Minimum character length" value={20} min={8} max={64} onChange={() => {}} />);
  const input = screen.getByRole('slider');
  expect(input).toHaveAttribute('aria-label', 'Minimum character length');
  expect(input).toHaveAttribute('min', '8');
  expect(input).toHaveAttribute('max', '64');
  expect(input.value).toBe('20');
});

test('falls back to label for aria-label when ariaLabel not provided', () => {
  render(<RangeSlider label="Min characters" value={16} min={8} max={64} onChange={() => {}} />);
  const input = screen.getByRole('slider');
  expect(input).toHaveAttribute('aria-label', 'Min characters');
});

test('calls onChange when value changes', () => {
  const onChange = jest.fn();
  render(<RangeSlider label="Min" value={16} min={8} max={64} onChange={onChange} />);
  fireEvent.change(screen.getByRole('slider'), { target: { value: '24' } });
  expect(onChange).toHaveBeenCalled();
});
