import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  LinearProgress,
  Slider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRandomWordsWithinLength } from './wordListUtils';

function App() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [minLength, setMinLength] = useState(16);
  const [maxLength, setMaxLength] = useState(32);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Derived values computed during render — no useEffect needed
  const charCount = password.length;
  const meetsLengthRequirements = charCount >= minLength && charCount <= maxLength;

  // Handle min length slider change
  const handleMinLengthChange = (event, newValue) => {
    if (newValue <= maxLength) {
      setMinLength(newValue);
    }
  };

  // Handle max length slider change
  const handleMaxLengthChange = (event, newValue) => {
    if (newValue >= minLength) {
      setMaxLength(newValue);
    }
  };

  // Function to generate a passphrase within length constraints
  const generatePassword = useCallback(async () => {
    if (generating) return; // Prevent concurrent generation (race condition guard)
    setGenerating(true);
    setError('');

    try {
      const result = await getRandomWordsWithinLength(minLength, maxLength);

      if (result.success) {
        setPassword(result.password);
      } else if (result.password) {
        // Best-effort result that didn't meet exact constraints
        setPassword(result.password);
        setError('Could not find an exact match for your length constraints. Showing closest result.');
      } else {
        setError('Could not generate a password with these constraints. Try widening the length range.');
      }
    } catch (err) {
      console.error('Error generating password:', err);
      setError('Failed to generate password. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [minLength, maxLength, generating]);

  // Function to copy password to clipboard with fallback
  const copyToClipboard = useCallback(async () => {
    if (!password) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(password);
      } else {
        // Fallback for non-HTTPS contexts (e.g., Docker on HTTP)
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy to clipboard.');
    }
  }, [password]);

  // Handle close of the copy notification
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setCopied(false);
    setError('');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Password Generator
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="body1" gutterBottom>
            Generate a secure multi-word passphrase with the click of a button.
          </Typography>

          {/* Length Range Sliders */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Minimum Characters: {minLength}
            </Typography>
            <Slider
              value={minLength}
              onChange={handleMinLengthChange}
              min={8}
              max={64}
              step={1}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Maximum Characters: {maxLength}
            </Typography>
            <Slider
              value={maxLength}
              onChange={handleMaxLengthChange}
              min={8}
              max={64}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={generatePassword}
              startIcon={<RefreshIcon />}
              size="large"
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Password'}
            </Button>
          </Box>

          {password && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Your generated password:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={password}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={copyToClipboard}
                  sx={{ ml: 1 }}
                  aria-label="copy to clipboard"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>

              {/* Character count and length range indicator */}
              <Box sx={{ mt: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    Character count: {charCount}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: meetsLengthRequirements ? 'success.main' : 'error.main',
                      fontWeight: 'medium'
                    }}
                  >
                    {meetsLengthRequirements
                      ? 'Meets length requirements'
                      : charCount < minLength
                        ? `Minimum ${minLength} characters required`
                        : `Maximum ${maxLength} characters exceeded`}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((charCount / minLength) * 100, 100)}
                  color={meetsLengthRequirements ? "success" : charCount > maxLength ? "error" : "primary"}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                This passphrase is generated locally and is not stored or transmitted.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <Snackbar open={copied} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Password copied to clipboard!
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="warning" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
