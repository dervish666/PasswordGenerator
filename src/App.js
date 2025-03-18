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
  LinearProgress
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import wordList from './wordList';

function App() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [meetsMinLength, setMeetsMinLength] = useState(false);
  const MIN_LENGTH = 16;

  // Update character count when password changes
  useEffect(() => {
    const count = password.length;
    setCharCount(count);
    setMeetsMinLength(count >= MIN_LENGTH);
  }, [password]);

  // Function to generate a three-word passphrase
  const generatePassword = () => {
    const selectedWords = [];
    
    // Select 3 random words from the word list
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      selectedWords.push(wordList[randomIndex].toLowerCase());
    }
    
    // Join with spaces
    const newPassword = selectedWords.join(' ');
    setPassword(newPassword);
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
            Generate a secure three-word passphrase with the click of a button.
          </Typography>
          
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
              
              {/* Character count and minimum length indicator */}
              <Box sx={{ mt: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    Character count: {charCount}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: meetsMinLength ? 'success.main' : 'error.main',
                      fontWeight: 'medium'
                    }}
                  >
                    {meetsMinLength ? 'Meets minimum length' : `Minimum ${MIN_LENGTH} characters required`}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((charCount / MIN_LENGTH) * 100, 100)}
                  color={meetsMinLength ? "success" : "primary"}
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