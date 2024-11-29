
import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputField from './InputField'; // Import your custom InputField component
import ButtonComponent from './Button'; // Import your custom ButtonComponent
import { login } from './store';

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
      const response = await axios.post('https://testcore-qmyu.onrender.com/api/v1/user/login', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setSuccess('Login successful!');
        setLoading(false);
        console.log(response.data.data); // This will give you the full response object

        // Extract the access token and user id
        const { accesToken } = response.data.data;
        const userId = response.data.data.userData.Id;
        // Store the access token and user id in localStorage
        localStorage.setItem('accesToken', accesToken);
        localStorage.setItem('userId', userId);

        console.log('Stored AccessToken:', localStorage.getItem('accesToken'));
        console.log('Stored UserId:', localStorage.getItem('userId'));
  

        // Prepare the user data to be dispatched to the Redux store
        const userdata = {
          name: response.data.data.userData.name,
          email: response.data.data.userData.email,
          image:
            'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg',
        };

        // Dispatch to Redux store
        dispatch(login(userdata));

        // Navigate to the dashboard
        navigate('/Dash-Board');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred during login.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1f1f1f, #3b3b3b)',
      }}
    >
      <div
        style={{
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0px 8px 16px rgba(0,0,0,0.4)',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '1rem' }}>Welcome Back</h2>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="role" style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue="Student"
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            >
              <option value="Student">Student</option>
              <option value="College">College</option>
              <option value="Examiner">Examiner</option>
            </select>
          </div>

          <InputField
            name="email"
            label="Email"
            type="email"
            required
            placeholder=""
            style={{ marginBottom: '1rem' }}
          />

          <InputField
            name="password"
            label="Password"
            type="password"
            required
            placeholder=" "
            style={{ marginBottom: '1rem' }}
          />

          <ButtonComponent
            type="submit"
            label={loading ? 'Loading...' : 'Login'}
            variant="primary"
            fullWidth
            onClick={() => {}}
            disabled={loading}
          />
        </form>

        <div style={{ textAlign: 'center', margin: '1rem 0', color: '#fff' }}>or</div>

        <ButtonComponent
          label="Sign in with Google"
          variant="secondary"
          fullWidth
          onClick={() => alert('Google login not implemented')}
        />

        <ButtonComponent
          label="Sign in with Facebook"
          variant="secondary"
          fullWidth
          onClick={() => alert('Facebook login not implemented')}
          style={{ marginTop: '1rem' }}
        />
      </div>
    </div>
  );
};

export default Login;
