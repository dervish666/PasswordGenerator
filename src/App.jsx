import React, { useState, useCallback } from 'react';
import PassphraseDisplay from './components/PassphraseDisplay';
import RangeSlider from './components/RangeSlider';
import RequirementsToggles from './components/RequirementsToggles';
import GenerateButton from './components/GenerateButton';
import NotificationBanner from './components/NotificationBanner';
import { getRandomWordsWithinLength, applyRequirements } from './wordListUtils';

function App() {
  const [password, setPassword] = useState('');
  const [minLength, setMinLength] = useState(16);
  const [maxLength, setMaxLength] = useState(32);
  const [generating, setGenerating] = useState(false);
  const [notification, setNotification] = useState({ message: '', severity: 'warning', autoDismissMs: 0 });
  const [animationKey, setAnimationKey] = useState(0);
  const [requirements, setRequirements] = useState({ capital: false, number: false, special: false });

  const handleMinChange = (val) => {
    if (val <= maxLength) setMinLength(val);
  };

  const handleMaxChange = (val) => {
    if (val >= minLength) setMaxLength(val);
  };

  const generatePassword = useCallback(async () => {
    if (generating) return;
    setGenerating(true);
    setNotification({ message: '', severity: 'warning', autoDismissMs: 0 });

    try {
      const result = await getRandomWordsWithinLength(minLength, maxLength, 100, { funnyMode: true });

      if (result.success) {
        setPassword(applyRequirements(result.password, requirements));
        setAnimationKey(k => k + 1);
      } else if (result.password) {
        setPassword(applyRequirements(result.password, requirements));
        setAnimationKey(k => k + 1);
        setNotification({
          message: 'Could not find an exact match for your length constraints. Showing closest result.',
          severity: 'warning',
          autoDismissMs: 6000,
        });
      } else {
        setNotification({
          message: 'Could not generate a passphrase with these constraints. Try widening the length range.',
          severity: 'error',
          autoDismissMs: 0,
        });
      }
    } catch (err) {
      setNotification({
        message: 'Failed to generate password. Please try again.',
        severity: 'error',
        autoDismissMs: 0,
      });
    } finally {
      setGenerating(false);
    }
  }, [minLength, maxLength, generating, requirements]);

  const copyToClipboard = useCallback(async () => {
    if (!password) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(password);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      // Clipboard write failed — CopyButton will still show "Copied!" visually
    }
  }, [password]);

  return (
    <main className="app-container app-fade-in">
      <h1 className="app-title">Password Generator</h1>
      <p className="app-tagline">Secure diceware passphrases, generated locally.</p>

      <PassphraseDisplay
        password={password}
        minLength={minLength}
        maxLength={maxLength}
        onCopy={copyToClipboard}
        animationKey={animationKey}
      />

      <NotificationBanner
        message={notification.message}
        severity={notification.severity}
        autoDismissMs={notification.autoDismissMs}
        onDismiss={() => setNotification({ message: '', severity: 'warning', autoDismissMs: 0 })}
      />

      <RangeSlider
        label="Min characters"
        ariaLabel="Minimum character length"
        value={minLength}
        min={8}
        max={64}
        onChange={handleMinChange}
      />

      <RangeSlider
        label="Max characters"
        ariaLabel="Maximum character length"
        value={maxLength}
        min={8}
        max={64}
        onChange={handleMaxChange}
      />

      <RequirementsToggles
        requirements={requirements}
        onChange={(key) => setRequirements(r => ({ ...r, [key]: !r[key] }))}
      />

      <GenerateButton loading={generating} onClick={generatePassword} />

      <p className="trust-footer">Generated locally. Never stored or transmitted.</p>
    </main>
  );
}

export default App;
