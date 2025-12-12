import React, { useState } from 'react';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/CollegeFunctions.css';

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
      const response = await apiClient.get(API_ENDPOINTS.COLLEGE.SUBJECT, {
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
        console.log(response.data);
      } else {
        throw new Error('Unexpected response format. Expected an array.');
      }
    } catch (err) {
      console.error('Error fetching timetables:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="college-card">
      <h2>Timetable Management</h2>

      <div className="college-search">
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

      {error && <div className="error-message">{error}</div>}

      <div className="table-wrapper">
        <table className="examiner-table">
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
                  <td>
                    <span className={timetable.state ? 'verified-badge' : ''}>
                      {timetable.state ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="loading-text">No timetables available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeTimetable;
