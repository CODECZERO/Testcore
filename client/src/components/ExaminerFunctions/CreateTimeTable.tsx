import React, { useState } from 'react';
import axios from 'axios';
import Spreadsheet from './Spreadsheet'; // Import the Spreadsheet component
import { Matrix } from 'react-spreadsheet'; // Import Matrix type for compatibility

type SpreadsheetData = Matrix<{ value: string } | undefined>; // Allow undefined cells
const BackendUrl = "https://testcore-qmyu.onrender.com";
function CreateTimetable() {
  const [ClassName, setClassName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [subjects, setSubjects] = useState<SpreadsheetData>([
    [{ value: 'Subject Name' }, { value: 'Subject Code' }],
    [{ value: '' }, { value: '' }],
  ]); // Initial empty subjects with headers
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form input changes
  const handleSubjectChange = (newData: Matrix<{ value: string } | undefined>) => {
    // Replace undefined cells with an empty object or default value
    const sanitizedData = newData.map((row) =>
      row.map((cell) => cell || { value: '' }) // Replace undefined cells
    );
    setSubjects(sanitizedData);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format the subjects data for backend (removing the header row)
    const formattedSubjects = subjects.slice(1).map((row) => ({
      name: row[0]?.value || '', // Handle undefined cells
      code: row[1]?.value || '', // Handle undefined cells
    }));

    const timetableData = {
      Class: ClassName,
      Subject: formattedSubjects,
      CollegeName: collegeName,
    };

    try {
      // Make POST request to create timetable
      const response = await axios.post(`${BackendUrl}/api/v1/examiner/timeTable`, timetableData);

      // Handle success response
      if (response.status === 201) {
        setSuccessMessage('Timetable created successfully!');
        setError('');
      }
    } catch (err) {
      // Handle error response safely
      if (axios.isAxiosError(err)) {
        // Check if the error is an Axios error
        setError(`Error: ${err.response?.data.message || 'Something went wrong'}`);
      } else if (err instanceof Error) {
        // Handle non-Axios errors that are of type Error
        setError(`Error: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h1>Create Timetable</h1>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Class</label>
          <input
            type="text"
            value={ClassName}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>College Name</label>
          <input
            type="text"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            required
          />
        </div>

        {/* Pass subjects and handle change to the Spreadsheet component */}
        <Spreadsheet data={subjects} onChange={handleSubjectChange} />

        <button type="submit">Create Timetable</button>
      </form>
    </div>
  );
}

export default CreateTimetable;
