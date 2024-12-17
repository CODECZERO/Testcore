import React, {useEffect,  useState } from 'react';
import axios from 'axios';
import '../styles/TimeTable.css'; // Style the modal with CSS
import ReusablePopup from './PopUp';
interface TimeTablePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimeTablePopup: React.FC<TimeTablePopupProps> = ({ isOpen, onClose }) => {
  const [userClass, setUserClass] = useState<string>(''); 
  const [timeTableData, setTimeTableData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const BackendUrl = "https://testcore-qmyu.onrender.com";

  const tabId = window.name; // Get the current tab's ID
  const userId = localStorage.getItem(`userId_${tabId}`) || '';
  const authToken = localStorage.getItem("accessToken");

  const fetchTimeTable = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${BackendUrl}/api/v1/student/TimeTable`, {
        userId:  userId,
        Class: userClass,
    },
    { headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
    },
}
);

console.log("userId in timetable 3",userId)
      setTimeTableData(response.data); // Store the timetable data
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching the timetable.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // If not open, return nothing

  return (
    <ReusablePopup isOpen={isOpen} onClose={onClose}>
      <div>
        <h3>Exam Timetable</h3>
        <div>
          <label>
            Enter Your Class:
            <input
              type="text"
              value={userClass}
              onChange={(e) => setUserClass(e.target.value)}
              placeholder="e.g., 12th A"
              style={{ margin: '10px', padding: '5px' }}
            />
          </label>
          <button onClick={fetchTimeTable} disabled={loading || !userClass}>
            {loading ? 'Loading...' : 'Fetch Timetable'}
          </button>
        </div>

        {/* Display Loading */}
        {loading && <p>Loading timetable...</p>}

        {/* Display Error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display Timetable Data */}
        {timeTableData && (
          <div style={{ marginTop: '10px' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(timeTableData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </ReusablePopup>
  );
};

export default TimeTablePopup;
