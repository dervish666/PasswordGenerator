import { render, screen, fireEvent } from '@testing-library/react';
import RequirementsToggles from './RequirementsToggles';

const defaults = { capital: false, number: false, special: false };

test('renders all three toggles', () => {
  render(<RequirementsToggles requirements={defaults} onChange={() => {}} />);
  expect(screen.getByText('Capital letter')).toBeInTheDocument();
  expect(screen.getByText('Number')).toBeInTheDocument();
  expect(screen.getByText('Special char')).toBeInTheDocument();
});

test('renders the Requirements label', () => {
  render(<RequirementsToggles requirements={defaults} onChange={() => {}} />);
  expect(screen.getByText('Requirements')).toBeInTheDocument();
});

test('calls onChange with correct key when toggled', () => {
  const onChange = vi.fn();
  render(<RequirementsToggles requirements={defaults} onChange={onChange} />);

  fireEvent.click(screen.getByLabelText('Require Capital letter'));
  expect(onChange).toHaveBeenCalledWith('capital');

  fireEvent.click(screen.getByLabelText('Require Number'));
  expect(onChange).toHaveBeenCalledWith('number');

  fireEvent.click(screen.getByLabelText('Require Special char'));
  expect(onChange).toHaveBeenCalledWith('special');
});

test('reflects checked state from requirements prop', () => {
  const reqs = { capital: true, number: false, special: true };
  render(<RequirementsToggles requirements={reqs} onChange={() => {}} />);

  expect(screen.getByLabelText('Require Capital letter')).toBeChecked();
  expect(screen.getByLabelText('Require Number')).not.toBeChecked();
  expect(screen.getByLabelText('Require Special char')).toBeChecked();
});
