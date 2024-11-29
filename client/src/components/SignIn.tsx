// import React, { useState, FormEvent } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import axios from 'axios';
// import { 
//   Box, Button, Typography, Divider, TextField, FormControl, 
//   MenuItem, Select, InputLabel, Card, SelectChangeEvent 
// } from '@mui/material';

// const Backend_URL = `https://testcore-qmyu.onrender.com`;

// type UserRole = 'Student' | 'College' | 'Examiner';

// interface FormData {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   age: number;
//   address: string;
//   role: UserRole;
//   password: string;
//   collegeID?: string;
// }

// const CreateAccount: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     phoneNumber: '',
//     age: 0,
//     address: '',
//     role: 'College',
//     password: '',
//     collegeID: ''
//   });

//   const [collegeID, setCollegeID] = useState<any[]>([]);
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<string>('');
//   const [click, setClick] = useState(false);
//   const navigate = useNavigate(); // Initialize useNavigate

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prevFormData => ({
//       ...prevFormData,
//       [name]: name === 'age' ? parseInt(value) : value
//     }));
//   };

//   const getCollegeID = (e: SelectChangeEvent<string>) => {
//     const selectedCollegeID = e.target.value;
//     setFormData(prevFormData => ({
//       ...prevFormData,
//       collegeID: selectedCollegeID || undefined
//     }));
//   };

//   const handleRoleChange = (e: SelectChangeEvent<string>) => {
//     const newRole = e.target.value as UserRole;
//     setFormData(prevFormData => ({
//       ...prevFormData,
//       role: newRole,
//       collegeID: newRole === 'Student' ? prevFormData.collegeID : ''
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     try {
//       const response = await axios.post(`${Backend_URL}/api/v1/user/signup`, formData);
//       setSuccess('Account created successfully!');
//       // Redirect to the dashboard after successful signup
//       setTimeout(() => {
//         navigate('/Dash-Board'); // Adjust the path as needed
//       }, 1000); // Optional delay to show success message
//     } catch (err) {
//       setError('An error occurred while creating the account.');
//     }
//   };

//   const getCollege = async () => {
//     if (click) return;
//     try {
//       const res = await axios.get(`${Backend_URL}/api/v1/user/signup`);
//       setCollegeID(res.data.data);
//       console.log('college list:', res.data.data);
//       setClick(true);
//     } catch (err) {
//       setError(`An error occurred while fetching colleges: ${err}`);
//     }
//   };

//   return (
//     <><Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '100vh',
//         padding: 4,
//         background: 'linear-gradient(135deg, #1f1f1f, #3b3b3b)',
//       }}
//     >
//       <Card
//         sx={{
//           padding: 4,
//           maxWidth: 500,
//           width: '100%',
//           borderRadius: '16px',
//           boxShadow: '0px 8px 16px rgba(0,0,0,0.4)',
//           backgroundColor: 'rgba(255, 255, 255, 0.2)',
//           backdropFilter: 'blur(10px)',
//         }}
//       >
//         <Typography
//           variant="h4"
//           component="h2"
//           sx={{
//             marginBottom: 2,
//             textAlign: 'center',
//             fontWeight: 'bold',
//             color: '#fff',
//           }}
//         >
//           Create Account
//         </Typography>

//         {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
//         {success && <Typography color="primary" sx={{ marginBottom: 2 }}>{success}</Typography>}

//         <form onSubmit={handleSubmit}>
//           <FormControl fullWidth sx={{ marginBottom: 2 }}>
//             <InputLabel id="role-label" sx={{ color: '#fff' }}>Role</InputLabel>
//             <Select
//               labelId="role-label"
//               id="role"
//               name="role"
//               value={formData.role}
//               onChange={handleRoleChange}
//               required
//               label="Role"
//               sx={{
//                 backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                 color: '#fff',
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#fff',
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#f57c00',
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#f57c00',
//                 },
//               }}
//             >
//               <MenuItem value="Student">Student</MenuItem>
//               <MenuItem value="College">College</MenuItem>
//               <MenuItem value="Examiner">Examiner</MenuItem>
//             </Select>
//           </FormControl>

//           <TextField
//             type="text"
//             name="name"
//             label="Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             fullWidth
//             sx={{
//               marginBottom: 2,
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//               color: 'white',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'grey',
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'orange',
//               },
//             }} />

//           <TextField
//             type="email"
//             name="email"
//             label="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             fullWidth
//             sx={{
//               marginBottom: 2,
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//               color: 'white',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'grey',
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'orange',
//               },
//             }} />

//           <TextField
//             type="tel"
//             name="phoneNumber"
//             label="Phone Number"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             required
//             fullWidth
//             sx={{
//               marginBottom: 2,
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//               color: 'white',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'grey',
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'orange',
//               },
//             }} />

//           <TextField
//             type="number"
//             name="age"
//             label="Age"
//             value={formData.age}
//             onChange={handleChange}
//             required
//             fullWidth
//             sx={{
//               marginBottom: 2,
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//               color: 'white',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'grey',
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'orange',
//               },
//             }} />

//           <TextField
//             type="text"
//             name="address"
//             label="Address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//             fullWidth
//             sx={{
//               marginBottom: 2,
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//               color: 'white',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'grey',
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'orange',
//               },
//             }} />


//           {formData.role === 'Student' && (
//             <FormControl fullWidth sx={{ marginBottom: 2 }}>
//               <InputLabel id="collegeID-label" sx={{ color: '#fff' }}>College Name</InputLabel>
//               <Select
//                 labelId="collegeID-label"
//                 id="collegeID"
//                 name="collegeID"
//                 value={formData.collegeID}
//                 onClick={getCollege}
//                 onChange={getCollegeID}
//                 required
//                 label="College Name"
//                 sx={{
//                   backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                   color: '#fff',
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#fff',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#f57c00',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#f57c00',
//                   },
//                 }}
//               >
//                 <MenuItem value="" disabled>Select your college</MenuItem>
//                 {collegeID.map((college, index) => (
//                   <MenuItem key={index} value={college.Id}>
//                     {college.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           )}

//           <TextField
//             type="password"
//             name="password"
//             label="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             fullWidth
//             sx={{
//               marginBottom: 2,
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//               color: 'white',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'grey',
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: 'orange',
//               },
//             }} />


        
//           <Button
//             type="submit"
//             variant="contained"
//             sx={{
//               backgroundColor: 'orange',
//               color: 'white',
//               '&:hover': {
//                 backgroundColor: 'darkorange',
//               },
//               width: '100%',
//               padding: '10px',
//               marginTop: 2,
//             }}
//           >
//             Create Account
//           </Button>
//         </form>
//         <Divider sx={{ my: 2, color: 'white' }}>or</Divider>
//         <Button fullWidth variant="outlined" color="primary">
//           Sign in with Google
//         </Button>
//         <Button fullWidth variant="outlined" color="primary" sx={{ marginTop: 2 }}>
//           Sign in with Facebook
//         </Button>

//       </Card>
//     </Box>
//     <Card />
//     </>
//     );

// };

// export default CreateAccount;



import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from './InputField'; // Reusable InputField component
import '../styles/CreateAccount.css'; // CSS file for styles
import ButtonComponent from './Button';

const Backend_URL = `https://testcore-qmyu.onrender.com`;

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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    age: 0,
    address: '',
    role: 'College',
    password: '',
    collegeID: '',
  });

  const [collegeID, setCollegeID] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [click, setClick] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'age' ? parseInt(value) : value,
    }));
  };

  const getCollegeID = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCollegeID = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      collegeID: selectedCollegeID || undefined,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: newRole,
      collegeID: newRole === 'Student' ? prevFormData.collegeID : '',
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${Backend_URL}/api/v1/user/signup`, formData);
      setSuccess('Account created successfully!');
      setTimeout(() => {
        navigate('/Dash-Board');
      }, 1000);
    } catch (err) {
      setError('An error occurred while creating the account.');
    }
  };

  const getCollege = async () => {
    if (click) return;
    try {
      const res = await axios.get(`${Backend_URL}/api/v1/user/signup`);
      setCollegeID(res.data.data);
      setClick(true);
    } catch (err) {
      setError(`An error occurred while fetching colleges: ${err}`);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <h2>Create Account</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
        <div className="form-group">
  <select
    id="role"
    name="role"
    value={formData.role}
    onChange={handleRoleChange}
    required
    className="select"
  >
    <option value="" disabled hidden>
      Choose your role
    </option>
    <option value="Student">Student</option>
    <option value="College">College</option>
    <option value="Examiner">Examiner</option>
  </select>
  <label htmlFor="role" className="animated-label">
    {'Role'.split('').map((char, index) => (
      <span key={index} style={{ transitionDelay: `${index * 50}ms` }}>
        {char}
      </span>
    ))}
  </label>
</div>


          <InputField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputField
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            type="tel"
            name="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <InputField
            type="number"
            name="age"
            label="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <InputField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          {formData.role === 'Student' && (
            <div className="form-group">
              <label htmlFor="collegeID">College Name</label>
              <select
                id="collegeID"
                name="collegeID"
                value={formData.collegeID}
                onClick={getCollege}
                onChange={getCollegeID}
                required
              >
                <option value="" disabled>Select your college</option>
                {collegeID.map((college, index) => (
                  <option key={index} value={college.Id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <InputField
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <ButtonComponent
            type="submit"
            label="Create Account"
            variant="primary"
            fullWidth
          />
        </form>

        <div className="divider">or</div>
        <ButtonComponent label="Sign in with Google" variant="secondary" fullWidth />
        <ButtonComponent label="Sign in with Facebook" variant="secondary" fullWidth />
      </div>
    </div>
  );
};

export default CreateAccount;
