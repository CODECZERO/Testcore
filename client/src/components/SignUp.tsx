import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './store';
import "../styles/Login.css"
import { nanoid } from 'nanoid';

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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


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
console.log(response.data);
        // Extract and store the token and user ID
        const { accessToken } = response.data.data;
        const userId = response.data.data.userData.Id;

         // Create a unique tab ID if it doesn't exist
         if (!window.name) {
          window.name = nanoid(); // Generate a unique tab ID
        }
        const tabId = window.name;

        // Store userId with a tab-specific key
        localStorage.setItem(`userId_${tabId}`, userId);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userRole', userData.role); 
       
 console.log(accessToken);
 console.log(userId);
        const userdata = {
          name: response.data.data.userData.name,
          email: response.data.data.userData.email,
          image:
            'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg',
        };

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
    <div className='container'>
  
      <div className="card2">
        <form className="form" onSubmit={handleSubmit}>
          <p id="heading">Welcome Back</p>

          {/* Error/Success Messages */}
          {error && <p className="message-error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          {/* Role Dropdown */}
          <div className="field">
            <svg
              className="input-icon"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 3l10 10M13 3L3 13"></path>
            </svg>
            <span>Role</span>
            <select
              id="role"
              name="role"
              className="input-field"
              defaultValue="Student"
              required
              >
              <option value="Student">Student</option>
              <option value="College">College</option>
              <option value="Examiner">Examiner</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="field">
          <svg
  viewBox="0 0 24 24"
  fill="currentColor"
  height="16"
  width="16"
  xmlns="http://www.w3.org/2000/svg"
  className="input-icon"
>
  <path
    d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 2-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
  ></path>
</svg>

            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="input-field"
              required
            />
          </div>

          {/* Password Input */}
          <div className="field">
      <svg
        className="input-icon"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
      </svg>
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        placeholder="Password"
        className="input-field"
        required
      />
      <button
        type="button"
        className="toggle-password-btn"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <svg
            className="eye-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        ) : (
          <svg
            className="eye-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.29 10.29 0 0 1 12 20c-7 0-11-8-11-8a20.21 20.21 0 0 1 5.4-5.4"></path>
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        )}
      </button>
    </div>

          <div className="btn">
            <button className="button1" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
            <button
              className="button2"
              type="button"
              onClick={() => navigate("/sign-in")}
            >
              Sign Up
            </button>
          </div>

          {/* Submit and Sign-Up Buttons */}
    
<button className="button3">Forgot Password?</button>
        </form>
      </div>
    </div>
  
  );
};

  export default Login;
  