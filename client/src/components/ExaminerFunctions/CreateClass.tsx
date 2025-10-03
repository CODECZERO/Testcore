import React, { useState } from 'react';
import axios from 'axios';
import ReusablePopup from '../StudentFunctions/PopUp'; // Import the popup component

const BackendUrl = "https://testcore-3en7.onrender.com";


interface CreateClassProps {

    isOpen: boolean;
  
    onClose: () => void;
  
  }
  
  const CreateClass: React.FC<CreateClassProps> = ({ isOpen, onClose }) => {
  const [className, setClassName] = useState<string>(''); // State for the class name input
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // State to control popup visibility


  const handleCreateClass = async () => {
    if (!className.trim()) {
      setErrorMessage('Class name cannot be empty.');
      setSuccessMessage(null);
      return;
    }

   
  try {
    const response = await axios.post(`${BackendUrl}/api/v1/user/class`, { Classname: className });

    // Ensure the response contains the Classname field
    if (response.data && response.data.data && response.data.data.name) {
      setSuccessMessage(`Class "${response.data.data.name}" created successfully!`);
    } else {
      setSuccessMessage('Class created successfully, but name is undefined in the response.');
    }

    setErrorMessage(null);
    setClassName(''); // Clear the input field
  } catch (error) {
    console.error('Error creating class:', error);
    setErrorMessage('Failed to create class. Please try again later.');
    setSuccessMessage(null);
  }
};
  return (
    <div>
      <button onClick={() => setIsPopupOpen(true)}>Open Create Class Form</button>

      <ReusablePopup isOpen={isOpen} onClose={onClose}>
        <h1>Create a New Class</h1>
        <div>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
          />
          <button onClick={handleCreateClass}>Create Class</button>
        </div>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button onClick={onClose}>Close</button>

      </ReusablePopup>
    </div>
  );
};

export default CreateClass;
