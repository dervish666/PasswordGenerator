import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowingChild = () => {
  throw new Error('Test error');
};

const GoodChild = () => <div>All good</div>;

test('renders children when no error', () => {
  render(
    <ErrorBoundary>
      <GoodChild />
    </ErrorBoundary>
  );
  expect(screen.getByText('All good')).toBeInTheDocument();
});

test('renders error UI when child throws', () => {
  // Suppress React error boundary console output during test
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <ThrowingChild />
    </ErrorBoundary>
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();

  spy.mockRestore();
});

test('shows a refresh button in error state', () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <ThrowingChild />
    </ErrorBoundary>
  );

  expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();

  spy.mockRestore();
});
