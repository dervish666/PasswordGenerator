import React from 'react';

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);

export default function GenerateButton({ loading, onClick }) {
  return (
    <button
      className={`generate-btn${loading ? ' generate-btn--loading' : ''}`}
      onClick={onClick}
      disabled={loading}
    >
      <RefreshIcon />
      {loading ? 'Generating...' : 'Generate Passphrase'}
    </button>
  );
}
