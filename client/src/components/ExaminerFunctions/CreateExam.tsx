import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendUrl = 'https://testcore-qmyu.onrender.com';

const CreateExam = () => {
    const [examId, setExamId] = useState('');
    const [questionPapers, setQuestionPapers] = useState([]);
    const [newQuestionPaper, setNewQuestionPaper] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Fetch question papers
    const fetchQuestionPapers = async () => {
        if (!examId) {
            setError('Exam ID is required');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const authToken = localStorage.getItem("accessToken");
            const response = await axios.get(`${BackendUrl}/api/v1/examiner/questionPaper`, {
                params: { examID: examId },
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setQuestionPapers(response.data.data);
        } catch (err) {
            setError('Failed to fetch question papers.');
        } finally {
            setLoading(false);
        }
    };

    // Create a new question paper
    const createQuestionPaper = async () => {
        if (!newQuestionPaper) {
            setError('Question paper data is required');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const authToken = localStorage.getItem("accessToken");
            const response = await axios.post(`${BackendUrl}/api/v1/examiner/questionPaper`, {
                examData: { examID: examId }, 
                QuestionPaperData: newQuestionPaper
            }, {
                headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' }
            });
            setMessage('Question paper created successfully!');
            fetchQuestionPapers();
        } catch (err) {
            setError('Failed to create question paper.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Examiner Question Paper Management</h2>
            <input
                type="text"
                placeholder="Enter Exam ID"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
            />
            <button onClick={fetchQuestionPapers} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Question Papers'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            <h3>Create Question Paper</h3>
            <textarea
                placeholder="Enter question paper content"
                value={newQuestionPaper}
                onChange={(e) => setNewQuestionPaper(e.target.value)}
            ></textarea>
            <button onClick={createQuestionPaper} disabled={loading}>
                {loading ? 'Submitting...' : 'Create Question Paper'}
            </button>

            <h3>Available Question Papers</h3>
            <ul>
                {questionPapers.length > 0 ? (
                    questionPapers.map((paper, index) => (
                        <li key={index}>{JSON.stringify(paper)}</li>
                    ))
                ) : (
                    <p>No question papers found.</p>
                )}
            </ul>
        </div>
    );
};

export default CreateExam;
