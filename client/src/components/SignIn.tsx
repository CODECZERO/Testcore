import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Box, Button, Typography,Divider, TextField, FormControl, MenuItem, Select, InputLabel, Card, SelectChangeEvent } from '@mui/material'; // Import SelectChangeEvent

type UserRole = 'Student' | 'College' | 'Examiner';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  address: string;
  role: UserRole;
  password: string;
  collegeID?: string;
}

const CreateAccount: React.FC = () => {
  const Backend_URL = "http://localhost:4008/api/v1/user/signup";

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    age: 0,
    address: '',
    role: 'College',
    password: '',
    collegeID: ''
  });

  const [collegeID, setCollegeID] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [click, setClick] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };

  // Use SelectChangeEvent<string> for Material UI Select
  const getCollegeID = (e: SelectChangeEvent<string>) => {
    const selectedCollegeID = e.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      collegeID: selectedCollegeID || undefined
    }));
  };

  // Use SelectChangeEvent<string> for role change
  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    const newRole = e.target.value as UserRole;
    setFormData(prevFormData => ({
      ...prevFormData,
      role: newRole,
      collegeID: newRole === 'Student' ? prevFormData.collegeID : ''
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${Backend_URL}`, formData);
      setSuccess('Account created successfully!');
    } catch (err) {
      setError('An error occurred while creating the account.');
    }
  };

  const getCollege = async () => {
    if (click) return;
    try {
      const res = await axios.get(`${Backend_URL}`);
      setCollegeID(res.data.data);
      setClick(true);
    } catch (err) {
      setError(`An error occurred while fetching colleges: ${err}`);
    }
  };

  return (
    <><Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 4,
        background: 'linear-gradient(135deg, #1f1f1f, #3b3b3b)',
      }}
    >
      <Card
        sx={{
          padding: 4,
          maxWidth: 500,
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0px 8px 16px rgba(0,0,0,0.4)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            marginBottom: 2,
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          Create Account
        </Typography>

        {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
        {success && <Typography color="primary" sx={{ marginBottom: 2 }}>{success}</Typography>}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="role-label" sx={{ color: '#fff' }}>Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              required
              label="Role"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fff',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#f57c00',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#f57c00',
                },
              }}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="College">College</MenuItem>
              <MenuItem value="Examiner">Examiner</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="text"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'grey',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'orange',
              },
            }} />

          <TextField
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'grey',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'orange',
              },
            }} />

          <TextField
            type="tel"
            name="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'grey',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'orange',
              },
            }} />

          <TextField
            type="number"
            name="age"
            label="Age"
            value={formData.age}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'grey',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'orange',
              },
            }} />

          <TextField
            type="text"
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'grey',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'orange',
              },
            }} />


          {formData.role === 'Student' && (
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="collegeID-label" sx={{ color: '#fff' }}>College Name</InputLabel>
              <Select
                labelId="collegeID-label"
                id="collegeID"
                name="collegeID"
                value={formData.collegeID}
                onClick={getCollege}
                onChange={getCollegeID}
                required
                label="College Name"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fff',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f57c00',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f57c00',
                  },
                }}
              >
                <MenuItem value="" disabled>Select your college</MenuItem>
                {collegeID.map((college, index) => (
                  <MenuItem key={index} value={college.Id}>
                    {college.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              marginBottom: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'grey',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'orange',
              },
            }} />


        
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'orange',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkorange',
              },
              width: '100%',
              padding: '10px',
              marginTop: 2,
            }}
          >
            Create Account
          </Button>
        </form>
        <Divider sx={{ my: 2, color: 'white' }}>or</Divider>
        <Button fullWidth variant="outlined" color="primary">
          Sign in with Google
        </Button>
        <Button fullWidth variant="outlined" color="primary" sx={{ marginTop: 2 }}>
          Sign in with Facebook
        </Button>

      </Card>
    </Box>
    <Card />
    </>
    );

};

export default CreateAccount;
