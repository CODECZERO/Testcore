import React, { useEffect, useState } from 'react';
import CollegeExaminer from './CollegeExaminer';
import CollegeTimetable from './CollegeTimeTable';
import ApproveTimetable from './ApproveTimetable';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import '../styles/CollegeFunctions.css';

const CollegeStudents = () => {
    interface Student {
        Id: string;
        name: string;
        email: string;
        phoneNumber: string;
        verified?: boolean;
    }

    const [student, setStudent] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the student data when the component mounts
        const fetchStudents = async () => {
            try {
                const response = await apiClient.get(API_ENDPOINTS.COLLEGE.STUDENT);
                setStudent(response.data.data);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleVerifyStudent = async (studentId: string) => {
        setVerifyingId(studentId);
        setVerifyMessage(null);
        try {
            await apiClient.put(API_ENDPOINTS.COLLEGE.STUDENT, { studentId });
            setVerifyMessage('Student verified successfully!');
            // Update local state to mark student as verified
            setStudent(prev => prev.map(s =>
                s.Id === studentId ? { ...s, verified: true } : s
            ));
        } catch (err) {
            setVerifyMessage(getErrorMessage(err));
        } finally {
            setVerifyingId(null);
        }
    };

    if (loading) return <div className="college-container"><p className="loading-text">Loading...</p></div>;
    if (error) return <div className="college-container"><div className="error-message">Error: {error}</div></div>;

    return (
        <div className="college-container">
            <div className="college-card">
                <h2>College Students</h2>

                {verifyMessage && (
                    <div className={verifyMessage.includes('success') ? 'success-message' : 'error-message'}>
                        {verifyMessage}
                    </div>
                )}

                {student.length > 0 ? (
                    <div className="college-list">
                        {student.map((s) => (
                            <div key={s.Id} className="college-list-item">
                                <div className="info">
                                    <span className="name">{s.name}</span>
                                    <span className="email">{s.email} • {s.phoneNumber}</span>
                                </div>
                                <div className="actions">
                                    {s.verified ? (
                                        <span className="verified-badge">Verified ✓</span>
                                    ) : (
                                        <button
                                            onClick={() => handleVerifyStudent(s.Id)}
                                            disabled={verifyingId === s.Id}
                                            className={`college-btn ${verifyingId === s.Id ? 'college-btn-disabled' : 'college-btn-primary'}`}
                                        >
                                            {verifyingId === s.Id ? 'Verifying...' : 'Verify Student'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="loading-text">No students found.</p>
                )}
            </div>

            <CollegeExaminer />
            <CollegeTimetable />
            <ApproveTimetable />
        </div>
    );
};

export default CollegeStudents;
