// App.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import "./../App.css";

type Role = 'Student' | 'College' | 'Examiner'; // Define a type for user roles

interface UserData {
    email: string,
    role: Role,
    password: string
}

const Login: React.FC = () => {
    // State for form fields

    // State for error and success messages
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');


    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const UserData:UserData=e.target;
        console.log(UserData.role?.value)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}`, UserData);
            setSuccess('Sign-up successful!');
            console.log(response.data);
        } catch (err) {
            setError('An error occurred during sign-up.');
            console.error(err);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        id="role"
                        name="role"
                        placeholder='Role'
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder='Email'
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder='Password'
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

        </div>
    )
};

export default Login;