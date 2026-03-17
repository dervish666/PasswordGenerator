import React from 'react';
import { render, screen, act } from '@testing-library/react';
import NotificationBanner from './NotificationBanner';

beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

test('renders nothing when message is empty', () => {
  const { container } = render(<NotificationBanner message="" />);
  expect(container.firstChild).toBeNull();
});

test('renders warning message', () => {
  render(<NotificationBanner message="Showing closest result." severity="warning" />);
  expect(screen.getByText('Showing closest result.')).toBeInTheDocument();
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

test('auto-dismisses after autoDismissMs', () => {
  const onDismiss = jest.fn();
  render(
    <NotificationBanner message="Warning" severity="warning" autoDismissMs={6000} onDismiss={onDismiss} />
  );
  expect(screen.getByText('Warning')).toBeInTheDocument();

  act(() => { jest.advanceTimersByTime(6000); });

  expect(onDismiss).toHaveBeenCalled();
});

test('does not auto-dismiss when autoDismissMs is 0', () => {
  const onDismiss = jest.fn();
  render(
    <NotificationBanner message="Error" severity="error" autoDismissMs={0} onDismiss={onDismiss} />
  );

  act(() => { jest.advanceTimersByTime(10000); });

  expect(onDismiss).not.toHaveBeenCalled();
  expect(screen.getByText('Error')).toBeInTheDocument();
});
