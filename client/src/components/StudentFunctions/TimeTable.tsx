import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TimeTable.css"; // Style the modal with CSS
import ReusablePopup from "./PopUp";

interface TimeTablePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimeTablePopup: React.FC<TimeTablePopupProps> = ({ isOpen, onClose }) => {
  const [userClass, setUserClass] = useState<string>("");
  const [timeTableData, setTimeTableData] = useState<any[]>([]); // Expect an array of objects
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const BackendUrl = "https://testcore-3en7.onrender.com";
  const tabId = window.name;
  const userId = localStorage.getItem(`userId_${tabId}`) || "";
  const authToken = localStorage.getItem("accessToken");

  const fetchTimeTable = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BackendUrl}/api/v1/student/TimeTable`,
        {
          userId: userId,
          Class: userClass,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Assume response.data.data.Subjects is an array of objects
      setTimeTableData(response.data.data.Subjects || []);
    } catch (err: any) {
      setError(
        err.message || "Something went wrong while fetching the timetable."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // If not open, return nothing

  // Get unique columns dynamically from data
  const columns = timeTableData.length > 0 ? Object.keys(timeTableData[0]) : [];

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
              style={{ margin: "10px", padding: "5px" }}
            />
          </label>
          <button onClick={fetchTimeTable} disabled={loading || !userClass}>
            {loading ? "Loading..." : "Fetch Timetable"}
          </button>
        </div>

        {/* Display Loading */}
        {loading && <p>Loading timetable...</p>}

        {/* Display Error */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Display Timetable Data */}
        {timeTableData.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <h4>Timetable for Class {userClass}</h4>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                textAlign: "left",
                margin: "10px 0",
              }}
            >
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} style={tableHeaderStyle}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeTableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} style={tableCellStyle}>
                        {row[column] || "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Handle No Data */}
        {timeTableData.length === 0 && !loading && !error && (
          <p>No timetable data available.</p>
        )}
      </div>
    </ReusablePopup>
  );
};

// Inline styles for table
const tableHeaderStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default TimeTablePopup;
