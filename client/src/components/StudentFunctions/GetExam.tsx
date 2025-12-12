import React, { useState } from 'react';
import ReusablePopup from './PopUp';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/StudentFunctions.css';

interface GetExamPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetExam: React.FC<GetExamPopupProps> = ({ isOpen, onClose }) => {
  const [questionPaper, setQuestionPaper] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionPaper = async () => {
    setLoading(true);
    setError(null);
    setQuestionPaper(null);

    try {
      const response = await apiClient.post(API_ENDPOINTS.STUDENT.QUESTION, {});
      setQuestionPaper(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ReusablePopup isOpen={isOpen} onClose={onClose}>
      <div className="student-popup-form">
        <h3>Exam Question Paper</h3>

        <button
          onClick={fetchQuestionPaper}
          disabled={loading}
          className="student-btn"
        >
          {loading ? 'Loading...' : 'Fetch Question Paper'}
        </button>

        {loading && <p className="loading-text">Loading question paper...</p>}
        {error && <div className="student-error">{error}</div>}

        {questionPaper && (
          <div className="question-paper">
            <h4>Question Paper:</h4>
            <pre>{JSON.stringify(questionPaper, null, 2)}</pre>
          </div>
        )}
      </div>
    </ReusablePopup>
  );
};

export default GetExam;
