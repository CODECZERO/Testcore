import React, { useState } from 'react';
import axios from 'axios';
import ReusablePopup from './PopUp';

interface GetExamPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetExam: React.FC<GetExamPopupProps> = ({ isOpen, onClose }) => {
  const [questionPaper, setQuestionPaper] = useState<any>(null); // Stores the fetched question paper
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message state

  const BackendUrl = "https://testcore-qmyu.onrender.com";
  const authToken = localStorage.getItem("accessToken"); // Access token for authentication

  const fetchQuestionPaper = async () => {
    setLoading(true);
    setError(null);
    setQuestionPaper(null);

    console.log("Fetching question paper...", authToken);
    try {
      // Send the request to the backend to fetch the question paper
      const response = await axios.post(
        `${BackendUrl}/api/v1/student/Question`,
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`, // Pass access token for authentication
          },
        }
      );

      // Set the question paper data in state
      setQuestionPaper(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch the question paper.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // If popup is not open, return nothing

  return (
    <ReusablePopup isOpen={isOpen} onClose={onClose}>
      <div>
        <h3>Exam Question Paper</h3>

        {/* Button to Fetch Question Paper */}
        <button onClick={fetchQuestionPaper} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Question Paper'}
        </button>

        {/* Display Loading */}
        {loading && <p>Loading question paper...</p>}

        {/* Display Error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display Question Paper Data */}
        {questionPaper && (
          <div style={{ marginTop: '20px' }}>
            <h4>Question Paper:</h4>
            <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f4f4f4', padding: '10px' }}>
              {JSON.stringify(questionPaper, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </ReusablePopup>
  );
};

export default GetExam;
