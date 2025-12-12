import React, { useState } from 'react';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/ExaminerFunctions.css';

interface Participant {
    Id: string;
    name: string;
    email: string;
    marks?: number;
}

const ExamParticipants: React.FC = () => {
    const [examId, setExamId] = useState('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Fetch participants for an exam
    const fetchParticipants = async () => {
        if (!examId) {
            setError('Exam ID is required');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await apiClient.get(API_ENDPOINTS.EXAMINER.AFTER_EXAM, {
                params: { examID: examId }
            });
            setParticipants(response.data.data || []);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    // Update marks for a participant
    const updateMarks = async (participantId: string, marks: number) => {
        setUpdatingId(participantId);
        setError('');
        setMessage('');

        try {
            await apiClient.put(API_ENDPOINTS.EXAMINER.AFTER_EXAM, {
                examID: examId,
                participantId,
                marks
            });
            setMessage(`Marks updated successfully for participant ${participantId}`);
            // Update local state
            setParticipants(prev => prev.map(p =>
                p.Id === participantId ? { ...p, marks } : p
            ));
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setUpdatingId(null);
        }
    };

    const handleMarksChange = (participantId: string, value: string) => {
        const marks = parseInt(value, 10);
        if (!isNaN(marks) && marks >= 0) {
            setParticipants(prev => prev.map(p =>
                p.Id === participantId ? { ...p, marks } : p
            ));
        }
    };

    return (
        <div className="examiner-container">
            <div className="examiner-form">
                <h2>Exam Participants & Marks</h2>

                <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                        <input
                            type="text"
                            placeholder="Enter Exam ID"
                            value={examId}
                            onChange={(e) => setExamId(e.target.value)}
                            className="form-group input"
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <button
                            onClick={fetchParticipants}
                            disabled={loading}
                            className="examiner-btn"
                        >
                            {loading ? 'Loading...' : 'Fetch Participants'}
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                {participants.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="examiner-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Marks</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.map((participant) => (
                                    <tr key={participant.Id}>
                                        <td>{participant.Id}</td>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                value={participant.marks ?? ''}
                                                onChange={(e) => handleMarksChange(participant.Id, e.target.value)}
                                                style={{ width: '80px', padding: '0.25rem' }}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => updateMarks(participant.Id, participant.marks || 0)}
                                                disabled={updatingId === participant.Id}
                                                className="college-btn college-btn-success"
                                            >
                                                {updatingId === participant.Id ? 'Saving...' : 'Save Marks'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    !loading && <p className="loading-text">No participants found. Enter an Exam ID and click "Fetch Participants".</p>
                )}
            </div>
        </div>
    );
};

export default ExamParticipants;
