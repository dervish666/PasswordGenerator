import React, { useState, useEffect } from 'react';
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
  const [charCount, setCharCount] = useState(0);
  const [meetsLengthRequirements, setMeetsLengthRequirements] = useState(false);
  const [minLength, setMinLength] = useState(16);
  const [maxLength, setMaxLength] = useState(32);

  // Update character count when password changes
  useEffect(() => {
    const count = password.length;
    setCharCount(count);
    setMeetsLengthRequirements(count >= minLength && count <= maxLength);
  }, [password, minLength, maxLength]);

  // Handle min length slider change
  const handleMinLengthChange = (event, newValue) => {
    // Ensure min doesn't exceed max
    if (newValue <= maxLength) {
      setMinLength(newValue);
    }
  };

  // Handle max length slider change
  const handleMaxLengthChange = (event, newValue) => {
    // Ensure max doesn't go below min
    if (newValue >= minLength) {
      setMaxLength(newValue);
    }
  };

  // Function to generate a passphrase within length constraints
  const generatePassword = async () => {
    try {
      // Get random words that form a password within the specified length range
      const result = await getRandomWordsWithinLength(minLength, maxLength);
      
      setPassword(result.password);
      
      if (!result.success) {
        console.warn('Could not generate password within exact constraints, using best effort');
      }
    } catch (error) {
      console.error('Error generating password:', error);
      // Fallback to a default password if there's an error
      setPassword('secure password generator');
    }
  };

  // Function to copy password to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Handle close of the copy notification
  const handleCloseCopyAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCopied(false);
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
            >
              Generate Password
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
      
      <Snackbar open={copied} autoHideDuration={3000} onClose={handleCloseCopyAlert}>
        <Alert onClose={handleCloseCopyAlert} severity="success" sx={{ width: '100%' }}>
          Password copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;