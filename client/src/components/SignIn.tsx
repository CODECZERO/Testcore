import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './CreateAccount.css';

type UserRole = 'Student' | 'College' | 'Examiner';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  address: string;
  role: UserRole;
  password: string;
  collegeID?: string; // Optional field for 'Student' role
}

const CreateAccount:React.FC = () => {

  const Backend_URL="http://localhost:4008/api/v1/user/signup";

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
  const [clikc, setClick] = useState(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };
  const getCollegeID = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCollegeID = e.target.value;
    
    const selectedCollege = collegeID.find(college => college.Id === selectedCollegeID);
    if (selectedCollege) {
      setFormData(prevFormData => ({
        ...prevFormData,
        collegeID: selectedCollegeID // Assuming college.id is what you're looking for
      }));
       }   else {
        setFormData(prevFormData => ({
          ...prevFormData,
          collegeID: undefined // Handle the case where the college is not found
        }));
      }
  };


  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setFormData(prevFormData => ({
      ...prevFormData,
      role: newRole,
      collegeID: newRole === 'Student' ? prevFormData.collegeID : '' // Clear collegeId if role is not 'Student'
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log(formData);

    try {
      console.log(formData)
      const response = await axios.post(`${Backend_URL}`, formData);
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
      const res = await axios.get(`${Backend_URL}`)
      console.log("Fetched College Data:", res.data); // Log the entire response to inspect its structure
      setCollegeID(res.data.data)
      setClick(true);

    }
    catch (err) {
      setError('An error occurred while creating the account.${err}');

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
                id="collegeID"
                name="collegeName"
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
      
    </div>
  );
}

export default CreateAccount;