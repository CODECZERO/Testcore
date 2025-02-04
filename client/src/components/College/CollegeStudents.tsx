

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CollegeExaminer from './CollegeExaminer';
import CollegeTimetable from './CollegeTimeTable';
import ApproveTimetable from './ApproveTimetable';

const BackendUrl = 'https://testcore-qmyu.onrender.com';

const CollegeStudents = () => {
    interface Student {
        Id: string;
        name: string;
        email: string;
        phoneNumber: string;
    }

    const [student, setStudent] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the student data when the component mounts
        const fetchStudents = async () => {
            try {
                const authToken = localStorage.getItem("accessToken");
                const response = await axios.get(`${BackendUrl}/api/v1/college/student`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Replace <your_token_here> with the actual token
                    }
                });
                setStudent(response.data.data);
                console.log(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch students. Please try again later.');
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>College Students</h1>
            {student.length > 0 ? (
                <ul>
                    {student.map((student) => (
                        <li key={student.Id}>
                            <p>ID: {student.Id}</p>
                            <p>Name: {student.name}</p>
                            <p>Email: {student.email}</p>
                            <p>Number: {student.phoneNumber}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No students found.</p>
            )}
            <CollegeExaminer/>
            <CollegeTimetable/>
           <ApproveTimetable/>
        </div>
    );
};

export default CollegeStudents;

