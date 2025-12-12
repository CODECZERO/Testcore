import React, { useState, useEffect } from 'react';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/ExaminerFunctions.css';

interface ClassItem {
  _id: string;
  name: string;
}

const ClassList: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.USER.CLASS);
        setClasses(response.data.data);
        console.log(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <div className="examiner-container"><p className="loading-text">Loading classes...</p></div>;
  if (error) return <div className="examiner-container"><div className="error-message">{error}</div></div>;

  return (
    <div className="examiner-container">
      <div className="examiner-form">
        <h2>Class List</h2>
        {classes.length > 0 ? (
          <div className="college-list">
            {classes.map((classItem) => (
              <div key={classItem._id} className="college-list-item">
                <div className="info">
                  <span className="name">{classItem.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="loading-text">No classes available.</p>
        )}
      </div>
    </div>
  );
};

export default ClassList;
