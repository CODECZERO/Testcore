import React, { useState } from "react";
import ReusablePopup from "../StudentFunctions/PopUp";
import apiClient, { getErrorMessage } from "../../services/api.service";
import { API_ENDPOINTS } from "../../config/api.config";
import "../styles/ExaminerFunctions.css";

interface SchedulePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExamScheduler: React.FC<SchedulePopupProps> = ({ isOpen, onClose }) => {
  const [examData, setExamData] = useState({
    subjectCode: "",
    subjectName: "",
    examName: "",
    date: "",
    examStart: "",
    examEnd: "",
    examDuration: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExamData({ ...examData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.EXAMINER.SCHEDULE_EXAM,
        examData
      );

      if (response.status === 201) {
        const { exam, tokenID } = response.data;
        console.log("Success", response.data);
        setSuccessMessage(
          `Exam scheduled successfully! Exam ID: ${exam.Id}, Token ID: ${tokenID}`
        );
      }
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusablePopup isOpen={isOpen} onClose={onClose}>
      <div className="examiner-form" style={{ padding: '1rem' }}>
        <h2>Schedule an Exam</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Subject Code</label>
              <input
                type="text"
                name="subjectCode"
                value={examData.subjectCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                name="subjectName"
                value={examData.subjectName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Exam Name</label>
            <input
              type="text"
              name="examName"
              value={examData.examName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={examData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                name="examDuration"
                value={examData.examDuration}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                name="examStart"
                value={examData.examStart}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                name="examEnd"
                value={examData.examEnd}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="examiner-btn" disabled={loading}>
            {loading ? 'Scheduling...' : 'Schedule Exam'}
          </button>
        </form>
      </div>
    </ReusablePopup>
  );
}

export default ExamScheduler;
