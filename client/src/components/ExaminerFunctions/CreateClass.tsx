import React, { useState } from 'react';
import ReusablePopup from '../StudentFunctions/PopUp';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/ExaminerFunctions.css';

interface CreateClassProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateClass: React.FC<CreateClassProps> = ({ isOpen, onClose }) => {
  const [className, setClassName] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateClass = async () => {
    if (!className.trim()) {
      setErrorMessage('Class name cannot be empty.');
      setSuccessMessage(null);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER.CLASS, { Classname: className });

      if (response.data && response.data.data && response.data.data.name) {
        setSuccessMessage(`Class "${response.data.data.name}" created successfully!`);
      } else {
        setSuccessMessage('Class created successfully!');
      }

      setErrorMessage(null);
      setClassName('');
    } catch (error) {
      console.error('Error creating class:', error);
      setErrorMessage(getErrorMessage(error));
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusablePopup isOpen={isOpen} onClose={onClose}>
      <div className="examiner-form" style={{ padding: '1rem' }}>
        <h2>Create a New Class</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="form-group">
          <label>Class Name</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            onClick={handleCreateClass}
            className="examiner-btn"
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Creating...' : 'Create Class'}
          </button>
          <button
            onClick={onClose}
            className="examiner-btn"
            style={{ flex: 1, background: '#666' }}
          >
            Close
          </button>
        </div>
      </div>
    </ReusablePopup>
  );
};

export default CreateClass;
