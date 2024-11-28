import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grow } from '@mui/material';




const FrontPage: React.FC = () => {
  const [checked, setChecked] = useState(false);

  // Trigger the grow effect after the component mounts
  useEffect(() => {
    setChecked(true);
  }, []);



  return (
    <Grow in={checked} timeout={1000}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1f1f1f, #3b3b3b)',
          padding: 3,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          align="center"
          gutterBottom
          sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}
        >
          Welcome to Our Application
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2, // Space between buttons
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px', // Button container max width
          }}
        >
          <Button
            component={Link}
            to="/sign-up"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#f57c00',
              color: '#fff',
              py: 1.5,
              borderRadius: '8px',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#fb8c00' },
            }}
          >
           Log In
          </Button>

          <Button
            component={Link}
            to="/sign-in"
            variant="outlined"
            fullWidth
            sx={{
              color: '#f57c00',
              borderColor: '#f57c00',
              py: 1.5,
              borderRadius: '8px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(245, 124, 0, 0.1)',
                borderColor: '#f57c00',
              },
            }}
          >
           Sign Up
          </Button>
        </Box>
      </Box>
    </Grow>
  );
};

export default FrontPage;

