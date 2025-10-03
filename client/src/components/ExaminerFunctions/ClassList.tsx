import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ClassItem {
  _id: string;
  name: string;
}

const BackendUrl = "https://testcore-3en7.onrender.com";

const ClassList: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]); // State to store class data
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    // Function to fetch classes from the backend
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/v1/user/class`);
        setClasses(response.data.data); // Assuming response.data contains the class list
        console.log(response.data);
      } catch (err) {
        setError('Failed to fetch classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []); // Empty dependency array ensures this runs only once

  if (loading) return <div>Loading classes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Class List</h1>
      {classes.length > 0 ? (
        <ul>
          {classes.map((classItem) => (
            <li key={classItem._id}>{classItem.name}</li> // Replace 'id' and 'name' with actual field names
          ))}
        </ul>
      ) : (
        <p>No classes available.</p>
      )}
    </div>
  );
};

export default ClassList;
