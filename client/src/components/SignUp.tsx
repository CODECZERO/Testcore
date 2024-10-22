import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Button, Typography, TextField, FormControl, MenuItem, Select, InputLabel, Card, Divider, CircularProgress } from '@mui/material';
import { login,store } from './store';

type Role = 'Student' | 'College' | 'Examiner';

interface UserData {
  email: string;
  role: Role;
  password: string;
}

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const userData: UserData = {
      role: formData.get('role') as Role,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await axios.post('http://localhost:4008/api/v1/user/Login', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setSuccess('Login successful!');
        setLoading(false);
        //creating object to store userdata and send it to state
        const userdata = {
          name: response.data.data.userData.name,
          email: response.data.data.userData.email,
          image:"https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg"
        }
        // Dispatch the action to set the login state
        dispatch(login(userdata));


        // Redirect to dashboard or desired page after login
        navigate('/Dash-Board');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred during login.');
      console.log(err)
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 4,
        background: 'linear-gradient(135deg, #1f1f1f, #3b3b3b)', // Dark gradient background
      }}
    >
      <Card
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: '16px', // Rounded corners
          boxShadow: '0px 8px 16px rgba(0,0,0,0.4)', // Deep shadow
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background for glass effect
          variant: "elevation=12",
          border: '1px solid rgba(255, 255, 255, 0.2)', // Optional border for glass effect
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'scale(1.01)' }, // Scale on hover
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            marginBottom: 2,
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff', // Adjusted text color for contrast
          }}
        >
          Welcome Back
        </Typography>

        {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
        {success && <Typography color="primary" sx={{ marginBottom: 2 }}>{success}</Typography>}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="role-label" sx={{}}>Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              defaultValue="Student"
              required
              label="Role"
              sx={{
                color: "black",
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {

                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#f57c00',
                  // Orange hover color
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#f57c00',
                  // Orange focus color
                },
              }}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="College">College</MenuItem>
              <MenuItem value="Examiner">Examiner</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: "black",
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: 'black',
                  },
                  '&:hover fieldset': {
                    borderColor: '#f57c00', // Orange hover color
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f57c00',
                  },
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              type="password"
              name="password"
              label="Password"
              variant="outlined"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  color: 'black',
                  '& fieldset': {
                    borderColor: 'black',
                  },
                  '&:hover fieldset': {
                    borderColor: '#f57c00', // Orange hover color
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f57c00', // Orange focus color
                  },
                },
              }}
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#f57c00',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#fb8c00' }, // Lighter orange on hover
              py: 1.5, // Increase padding for button
              borderRadius: '8px', // Rounded button corners
            }}
          >
            Login
          </Button>
        </form>

        <Divider sx={{ color: "white", my: 2 }}>or</Divider>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: '#f57c00',
            borderColor: '#f57c00',
            '&:hover': {
              backgroundColor: 'rgba(245, 124, 0, 0.1)',
              borderColor: '#f57c00',
            },
            borderRadius: '8px',
            py: 1.5,
          }}
        >
          Sign in with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: '#3b5998',
            borderColor: '#3b5998',
            '&:hover': {
              backgroundColor: 'rgba(59, 89, 152, 0.1)',
              borderColor: '#3b5998',
            },
            borderRadius: '8px',
            py: 1.5,
            mt: 2,
          }}
        >
          Sign in with Facebook
        </Button>
      </Card>
    </Box>
  );
};

export default Login;
