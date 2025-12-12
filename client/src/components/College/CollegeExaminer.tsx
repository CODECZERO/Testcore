import React, { useEffect, useState } from 'react';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/CollegeFunctions.css';

interface Examiner {
    id: number;
    name: string;
    email: string;
    department: string;
}

const CollegeExaminer: React.FC = () => {
    const [examiners, setExaminers] = useState<Examiner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExaminers = async () => {
            try {
                const response = await apiClient.get(API_ENDPOINTS.COLLEGE.EXAMINER);
                setExaminers(response.data.data);
                console.log(response.data);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchExaminers();
    }, []);

    if (loading) return <div className="college-container"><p className="loading-text">Loading examiners...</p></div>;
    if (error) return <div className="college-container"><div className="error-message">Error: {error}</div></div>;

    return (
        <div className="college-card">
            <h2>College Examiners</h2>
            {examiners.length > 0 ? (
                <div className="college-list">
                    {examiners.map((examiner) => (
                        <div key={examiner.id} className="college-list-item">
                            <div className="info">
                                <span className="name">{examiner.name}</span>
                                <span className="email">{examiner.email} • {examiner.department}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="loading-text">No examiners found.</p>
            )}
        </div>
    );
};

export default CollegeExaminer;
