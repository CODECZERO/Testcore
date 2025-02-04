// CollegeTimetableComponent.tsx
import React, { useState } from 'react';
import axios from 'axios';

const BackendUrl = "https://testcore-qmyu.onrender.com";

interface Subject {
  name: string;
  code: string;
}

interface Timetable {
  id: string;
  class: string;
  subjects: Subject[];
  date?: string;
  time?: string;
  state: boolean;
}

const CollegeTimetable: React.FC = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [collegeName, setCollegeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch timetables for the college
  const fetchTimetables = async () => {
    if (!collegeName) {
      setError('Please enter a college name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
        const authToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${BackendUrl}/api/v1/college/subject`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: { collegeName },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setTimetables(response.data.data.map((item: any) => ({
          id: item._id,
          class: item.Class,
          subjects: item.Subjects || [],
          date: item.date || 'N/A',
          time: item.time || 'N/A',
          state: item.Aprrove || false,
        })));
        console.log(response.data)
      } else {
        throw new Error('Unexpected response format. Expected an array.');
      }
    } catch (err: any) {
      console.error('Error fetching timetables:', err); // Log the full error object
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred while fetching timetables.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timetable-container">
      <h1>College Timetable Management</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter College Name"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
        />
        <button onClick={fetchTimetables} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Timetables'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <table className="timetable-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Subjects</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(timetables) && timetables.length > 0 ? (
            timetables.map((timetable) => (
              <tr key={timetable.id}>
                <td>{timetable.class}</td>
                <td>{
                  timetable.subjects && Array.isArray(timetable.subjects)
                    ? timetable.subjects
                        .map((subject) => `${subject.name} (${subject.code})`)
                        .join(', ')
                    : 'N/A'
                }</td>
                <td>{timetable.date}</td>
                <td>{timetable.time}</td>
                <td>{timetable.state ? 'Approved' : 'Pending'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No timetables available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeTimetable;
