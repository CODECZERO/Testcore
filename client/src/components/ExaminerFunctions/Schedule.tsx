import React, { useState } from "react";
import axios from "axios";
import ReusablePopup from "../StudentFunctions/PopUp";

const BackendUrl = "https://testcore-qmyu.onrender.com";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExamData({ ...examData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const authToken = localStorage.getItem("accessToken"); // Assuming auth token is stored locally

      const response = await axios.post(
        `${BackendUrl}/api/v1/examiner/scheduleExam`,
        examData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        const { exam, tokenID } = response.data;
        console.log("Success", response.data);
        setSuccessMessage(
          `Exam scheduled successfully! Exam ID: ${exam.Id}, Token ID: ${tokenID}`
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(
          err.response?.data.message || "Failed to schedule the exam. Try again."
        );
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <ReusablePopup isOpen={isOpen} onClose={onClose}>
    <div>
      <h1>Schedule an Exam</h1>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Subject Code:
            <input
              type="text"
              name="subjectCode"
              value={examData.subjectCode}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Subject Name:
            <input
              type="text"
              name="subjectName"
              value={examData.subjectName}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Exam Name:
            <input
              type="text"
              name="examName"
              value={examData.examName}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={examData.date}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Exam Start Time:
            <input
              type="time"
              name="examStart"
              value={examData.examStart}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Exam End Time:
            <input
              type="time"
              name="examEnd"
              value={examData.examEnd}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Exam Duration (in minutes):
            <input
              type="number"
              name="examDuration"
              value={examData.examDuration}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <button type="submit">Schedule Exam</button>
      </form>
    </div>
    </ReusablePopup>
  );
}

export default ExamScheduler;
