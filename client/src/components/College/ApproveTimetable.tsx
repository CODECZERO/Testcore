import React, { useState } from 'react';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/CollegeFunctions.css';

const ApproveTimetable = () => {
    const [timetableId, setTimetableId] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleApprove = async () => {
        if (!timetableId) {
            setError('Timetable ID is required');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await apiClient.put(API_ENDPOINTS.COLLEGE.SUBJECT, {
                timetableId,
                state: true
            });

            setMessage(response.data.message || 'Timetable approved successfully!');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="college-card">
            <h2>Approve Timetable</h2>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="college-search">
                <input
                    type="text"
                    placeholder="Enter Timetable ID"
                    value={timetableId}
                    onChange={(e) => setTimetableId(e.target.value)}
                />
                <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="college-btn-success"
                >
                    {loading ? 'Approving...' : 'Approve Timetable'}
                </button>
            </div>
        </div>
    );
};

export default ApproveTimetable;
