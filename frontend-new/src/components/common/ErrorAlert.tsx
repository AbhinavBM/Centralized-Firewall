import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error" variant="outlined">
        <AlertTitle>Error</AlertTitle>
        {message}
        {onRetry && (
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={onRetry} variant="outlined" color="error">
              Retry
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
