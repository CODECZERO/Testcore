// CollegeTimetableComponent.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendUrl = 'https://testcore-qmyu.onrender.com';
interface Timetable {
  id: string;
  subject: string;
  date: string;
  time: string;
  state: boolean;
}

const CollegeTimetableComponent: React.FC = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [collegeName, setCollegeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authToken = localStorage.getItem("accessToken");

  // Fetch timetables for the college
  const fetchTimetables = async () => {
    if (!collegeName) {
      setError('Please enter a college name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${BackendUrl}/api/v1/subject`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {collegeName},
      });
      setTimetables(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch timetables.');
      console.log(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Approve or update timetable state
  const updateTimetableState = async (timetableId: string, state: boolean) => {
    try {
      await axios.put(
        `${BackendUrl}/api/v1/subject`,
        { timetableId, state },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setTimetables((prev) =>
        prev.map((t) => (t.id === timetableId ? { ...t, state } : t))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update timetable state.');
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

      <div className="timetable-list">
        {timetables.map((timetable) => (
          <div key={timetable.id} className="timetable-item">
            <p><strong>Subject:</strong> {timetable.subject}</p>
            <p><strong>Date:</strong> {timetable.date}</p>
            <p><strong>Time:</strong> {timetable.time}</p>
            <p><strong>State:</strong> {timetable.state ? 'Approved' : 'Pending'}</p>
            <button
              onClick={() => updateTimetableState(timetable.id, !timetable.state)}
              className={timetable.state ? 'btn-disapprove' : 'btn-approve'}
            >
              {timetable.state ? 'Disapprove' : 'Approve'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeTimetableComponent;
