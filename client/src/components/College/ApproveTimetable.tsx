import React, { useState } from 'react';
import axios from 'axios';

const BackendUrl = 'https://testcore-qmyu.onrender.com';

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
            const authToken = localStorage.getItem("accessToken");
            const response = await axios.put(`${BackendUrl}/api/v1/college/subject`, {
                timetableId,
                state: true
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setMessage(response.data.message || 'Timetable approved successfully!');
        } catch (err) {
            setError('Failed to approve timetable. Please try again.');
        } finally {
            setLoading(false);
        }
       
    };

    return (
        <div>
            <h2>Approve Timetable</h2>
            <input
                type="text"
                placeholder="Enter Timetable ID"
                value={timetableId}
                onChange={(e) => setTimetableId(e.target.value)}
            />
            <button onClick={handleApprove} disabled={loading}>
                {loading ? 'Approving...' : 'Approve Timetable'}
            </button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ApproveTimetable;
