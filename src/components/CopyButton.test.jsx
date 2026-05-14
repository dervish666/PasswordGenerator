import { render, screen, fireEvent, act } from '@testing-library/react';
import CopyButton from './CopyButton';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('renders with "Copy" text', () => {
  render(<CopyButton text="hello" />);
  expect(screen.getByLabelText('Copy passphrase to clipboard')).toBeInTheDocument();
  expect(screen.getByText('Copy')).toBeInTheDocument();
});

test('calls onCopy and shows "Copied!" on click', async () => {
  const onCopy = vi.fn().mockResolvedValue(undefined);
  render(<CopyButton text="hello" onCopy={onCopy} />);

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Copy passphrase to clipboard'));
  });

  expect(onCopy).toHaveBeenCalled();
  expect(screen.getByText('Copied!')).toBeInTheDocument();
  expect(screen.getByLabelText('Passphrase copied')).toBeInTheDocument();
});

test('reverts to "Copy" after 2 seconds', async () => {
  const onCopy = vi.fn().mockResolvedValue(undefined);
  render(<CopyButton text="hello" onCopy={onCopy} />);

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Copy passphrase to clipboard'));
  });

  expect(screen.getByText('Copied!')).toBeInTheDocument();

  act(() => { vi.advanceTimersByTime(2000); });

  expect(screen.getByText('Copy')).toBeInTheDocument();
});

test('is not rendered when text is empty', () => {
  const { container } = render(<CopyButton text="" />);
  expect(container.firstChild).toBeNull();
});
