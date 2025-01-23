import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BackendUrl = 'https://testcore-qmyu.onrender.com';

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
                const authToken = localStorage.getItem("accessToken");
                const response = await axios.get(`${BackendUrl}/api/v1/examiner`, {
                    headers: {
                        Authorization: `Bearer ${authToken}` // Replace <your_token_here> with the actual token
                    }
                });
                setExaminers(response.data);
                setLoading(false);
                
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchExaminers();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>College Examiners</h1>
            {examiners.length > 0 ? (
                <ul>
                    {examiners.map((examiner) => (
                        <li key={examiner.id}>
                            <p>Name: {examiner.name}</p>
                            <p>Email: {examiner.email}</p>
                            <p>Department: {examiner.department}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No examiners found.</p>
            )}
        </div>
    );
};

export default CollegeExaminer;
