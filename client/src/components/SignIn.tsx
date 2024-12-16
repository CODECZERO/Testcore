import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CreateAccount.css'; // CSS file for styles

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
  confirmPassword: string;
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
    confirmPassword: '',
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
       <div className='container'>
    <div className="create-account-container">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="flex">
          <label>
            <span>First Name</span>
            <input
              className="input"
              type="text"
              name="firstName"
              placeholder=""
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>

        </div>

        <label>
          <span>Email</span>
          <input
            className="input"
            type="email"
            name="email"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Phone Number</span>
          <input
            className="input"
            type="tel"
            name="phoneNumber"
            placeholder=""
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Age</span>
          <input
            className="input"
            type="number"
            name="age"
            placeholder=""
            value={formData.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Address</span>
          <input
            className="input"
            type="text"
            name="address"
            placeholder=""
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <div className="form-group">
          <span>Role</span>
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
        </div>

        {formData.role === 'Student' && (
          <div className="form-group">
            <label htmlFor="collegeID" style={{color:"#fff"}}>College Name</label>
            <select
              id="collegeID"
              name="collegeID"
              value={formData.collegeID}
              onClick={getCollege}
              onChange={getCollegeID}
              required
            >
              <option value="" disabled>
                Select your college
              </option>
              {collegeID.map((college, index) => (
                <option key={index} value={college.Id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <label>
          <span>Password</span>
          <input
            className="input"
            type="password"
            name="password"
            placeholder=""
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Confirm Password</span>
          <input
            className="input"
            type="password"
            name="confirmPassword"
            placeholder=""
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="submit">
          Submit
        </button>

        <p className="signin">
          Already have an account? {" "} <a href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/sign-up")
          }}>Sign in</a>
        </p>
      </form>
    </div>
    </div>
  );
};

export default CreateAccount;
