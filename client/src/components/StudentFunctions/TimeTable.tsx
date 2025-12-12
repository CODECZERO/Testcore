import React, { useState } from "react";
import ReusablePopup from "./PopUp";
import apiClient, { getErrorMessage } from "../../services/api.service";
import { API_ENDPOINTS } from "../../config/api.config";
import "../styles/StudentFunctions.css";

interface TimeTablePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimeTablePopup: React.FC<TimeTablePopupProps> = ({ isOpen, onClose }) => {
  const [userClass, setUserClass] = useState<string>("");
  const [timeTableData, setTimeTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const tabId = window.name;
  const userId = localStorage.getItem(`userId_${tabId}`) || "";

  const fetchTimeTable = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(API_ENDPOINTS.STUDENT.TIMETABLE, {
        userId: userId,
        Class: userClass,
      });

      setTimeTableData(response.data.data.Subjects || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const columns = timeTableData.length > 0 ? Object.keys(timeTableData[0]) : [];

  return (
    <ReusablePopup isOpen={isOpen} onClose={onClose}>
      <div className="student-popup-form">
        <h3>Exam Timetable</h3>

        <div className="student-form-group">
          <label>Enter Your Class:</label>
          <input
            type="text"
            value={userClass}
            onChange={(e) => setUserClass(e.target.value)}
            placeholder="e.g., 12th A"
          />
        </div>

        <button
          onClick={fetchTimeTable}
          disabled={loading || !userClass}
          className="student-btn"
        >
          {loading ? "Loading..." : "Fetch Timetable"}
        </button>

        {loading && <p className="loading-text">Loading timetable...</p>}
        {error && <div className="student-error">{error}</div>}

        {timeTableData.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Timetable for Class {userClass}</h4>
            <div className="student-table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeTableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>{row[column] || "N/A"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {timeTableData.length === 0 && !loading && !error && (
          <p className="loading-text">No timetable data available.</p>
        )}
      </div>
    </ReusablePopup>
  );
};

export default TimeTablePopup;
