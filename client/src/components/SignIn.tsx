import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

type UserRole = 'Student' | 'College' | 'Examiner';

interface FormData {
    name: string;
    email: string;
    phoneNumber: string;
    age: number;
    address: string;
    role: UserRole;
    password: string;
    collegeId?: string; // Optional field for 'Student' role
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
        collegeId: ''
    });
    const [collegeID, setCollegeID] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [clikc, setClick] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: name === 'age' ? parseInt(value) : value
        }));
    };

    const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as UserRole;
        setFormData(prevFormData => ({
            ...prevFormData,
            role: newRole,
            collegeId: newRole === 'Student' ? prevFormData.collegeId : '' // Clear collegeId if role is not 'Student'
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            console.log(formData)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`, formData);
            setSuccess('Account created successfully!');
            console.log(response.data);
        } catch (err) {
            setError('An error occurred while creating the account.');
            console.error(err);
        }
    };

    const getCollege = async () => {

        if (clikc) {
            return;
        }
            try {
                console.log(formData)
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`).then((res) => {
                    if (res) {
                        res.data.map((data: any) => {
                            setCollegeID(data);
                        })
                    }
                });
                setSuccess('Account created successfully!');
                setCollegeID(res.data.data)
                console.log(collegeID);
                setClick(true);

            }
            catch (err) {
                setError(`An error occurred while creating the account.${err}`);

            }
    }

return (
    <div className="create-account-page">
        <div className="create-account-container">
            <h2>Create Account</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleRoleChange}
                        required
                    >
                        <option value="Student">Student</option>
                        <option value="College">College</option>
                        <option value="Examiner">Examiner</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                {formData.role === 'Student' && (
                    <div className="form-group">
                        <label htmlFor="role">College Name</label>
                        <select
                            id="collegeName"
                            name="collegeID"
                            value={formData.collegeId}
                            onClick={getCollege}
                            required
                        >
                            {collegeID.map((college, index) => (
                                <option key={index} value={college.name}>{college.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Create Account</button>
            </form>
        </div>
        <style>{`
                .create-account-page {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #6e8efb, #a777e3);
                    font-family: 'Arial', sans-serif;
                    color: #fff;
                }

                .create-account-container {
                    max-width: 400px;
                    width: 100%;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                    background: #ffffff;
                    color: #333;
                    text-align: center;
                }

                h2 {
                    margin-bottom: 20px;
                    font-size: 28px;
                }

                .form-group {
                    margin-bottom: 20px;
                    text-align: left;
                }

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                }

                input, select {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-sizing: border-box;
                    font-size: 16px;
                    transition: border-color 0.3s ease;
                }

                input:focus, select:focus {
                    border-color: #6e8efb;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(110, 143, 251, 0.3);
                }

                button {
                    width: 100%;
                    padding: 14px;
                    background-color: #6e8efb;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                }

                button:hover {
                    background-color: #5a7dcd;
                    transform: translateY(-2px);
                }

                button:active {
                    background-color: #4a69d4;
                    transform: translateY(0);
                }

                .error-message {
                    color: #dc3545;
                    font-size: 14px;
                    margin-bottom: 15px;
                }

                .success-message {
                    color: #28a745;
                    font-size: 14px;
                    margin-bottom: 15px;
                }
            `}</style>
    </div>
)}};

export default CreateAccount;