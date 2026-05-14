import { Fragment, useState, useEffect } from 'react';
import CopyButton from './CopyButton';

export default function PassphraseDisplay({ password, minLength, maxLength, onCopy, animationKey }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!password) return;
    setAnimate(false); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: reset+raf triggers CSS animation restart
    // Force a reflow so removing and re-adding the class triggers animation
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [password, animationKey]);

  const words = password ? password.split(' ') : [];
  const charCount = password.length;
  const meetsRange = charCount >= minLength && charCount <= maxLength;

  let statusMessage;
  let statusClass = '';
  if (password) {
    if (meetsRange) {
      statusMessage = 'Meets range';
      statusClass = 'status-text--success';
    } else if (charCount < minLength) {
      statusMessage = 'Below minimum';
      statusClass = 'status-text--warning';
    } else {
      statusMessage = 'Exceeds maximum';
      statusClass = 'status-text--warning';
    }
  }

  return (
    <div id="passphrase-panel" className="passphrase-panel">
      <div data-testid="passphrase-display" aria-live="polite">
        {password ? (
          <div className="passphrase-text">
            {words.map((word, i) => (
              <Fragment key={`${animationKey}-${i}`}>
                {i > 0 && ' '}
                <span className={animate ? 'passphrase-word' : ''}>
                  {word}
                </span>
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="passphrase-placeholder">
            Click generate to create a passphrase
          </div>
        )}
      </div>

      {password && (
        <div className="status-row">
          <span className="status-text">
            {charCount} chars
            {' '}
            <span className={statusClass}>{statusMessage}</span>
          </span>
          <CopyButton text={password} onCopy={onCopy} />
        </div>
      )}
    </div>
  );
}
