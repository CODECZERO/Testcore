import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BackendUrl = "https://testcore-qmyu.onrender.com";

interface Timetable {
    id: number;
    course: string;
    time: string;
    day: string;
}

const CollegeTimetables: React.FC = () => {
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimetables = async () => {
            try {
                const authToken = localStorage.getItem("accessToken");
                const response = await axios.get(`${BackendUrl}/api/v1/subject`, {
            
                    headers: {
                        Authorization: `Bearer ${authToken} ` // Replace <your_token_here> with the actual token
                    }
                });
                setTimetables(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTimetables();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Timetables </h1>
            {timetables.length > 0 ? (
                <ul>
                    {timetables.map((timetable) => (
                        <li key={timetable.id}>
                            <p>Course: {timetable.course}</p>
                            <p>Time: {timetable.time}</p>
                            <p>Day: {timetable.day}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No timetables found for .</p>
            )}
        </div>
    );
};

export default CollegeTimetables;
