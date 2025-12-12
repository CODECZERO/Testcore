import React, { useState } from 'react';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/ExaminerFunctions.css';

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
            const response = await apiClient.get(API_ENDPOINTS.EXAMINER.QUESTION_PAPER, {
                params: { examID: examId }
            });
            setQuestionPapers(response.data.data);
        } catch (err) {
            setError(getErrorMessage(err));
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
            await apiClient.post(API_ENDPOINTS.EXAMINER.QUESTION_PAPER, {
                examData: { examID: examId },
                QuestionPaperData: newQuestionPaper
            });
            setMessage('Question paper created successfully!');
            fetchQuestionPapers();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="examiner-container">
            <div className="examiner-form">
                <h2>Question Paper Management</h2>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                        <input
                            type="text"
                            placeholder="Enter Exam ID"
                            value={examId}
                            onChange={(e) => setExamId(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <button
                            onClick={fetchQuestionPapers}
                            disabled={loading}
                            className="examiner-btn"
                        >
                            {loading ? 'Loading...' : 'Fetch Papers'}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Create Question Paper</label>
                    <textarea
                        placeholder="Enter question paper content"
                        value={newQuestionPaper}
                        onChange={(e) => setNewQuestionPaper(e.target.value)}
                        rows={6}
                    ></textarea>
                </div>

                <button
                    onClick={createQuestionPaper}
                    disabled={loading}
                    className="examiner-btn"
                >
                    {loading ? 'Submitting...' : 'Create Question Paper'}
                </button>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Available Question Papers</h3>
                {questionPapers.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="examiner-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Content</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questionPapers.map((paper, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{JSON.stringify(paper)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="loading-text">No question papers found. Enter an Exam ID and fetch.</p>
                )}
            </div>
        </div>
    );
};

export default CreateExam;
