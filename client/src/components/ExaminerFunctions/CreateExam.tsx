import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import ClassList from './ClassList';

const BackendUrl = "https://testcore-qmyu.onrender.com";

const CreateExam: React.FC = () => {
    const [examData, setExamData] = useState({
        questionPaperData: '',
        examDetails: ''
    });
    const [response, setResponse] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExamData({ ...examData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setResponse(null);

        if (!examData.questionPaperData.trim() || !examData.examDetails.trim()) {
            setError("All fields are required.");
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("User not authenticated. Please log in.");
                return;
            }

            console.log("Payload being sent:", {
                QuestionPaperData: examData.questionPaperData,
                examData: examData.examDetails,
            });

            const res = await axios.post(
                `${BackendUrl}/api/v1/examiner/questionPaper`,
                {
                    questionPaperData: examData.questionPaperData,
                    examData: examData.examDetails,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.status === 201) {
                setResponse(res.data);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(err.response.data.message || "Invalid request.");
                } else if (err.request) {
                    setError("No response from server. Please try again.");
                } else {
                    setError("Error: " + err.message);
                }
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="create-exam">
            <h2>Create Exam</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="questionPaperData">Question Paper Data:</label>
                    <textarea
                        id="questionPaperData"
                        name="questionPaperData"
                        value={examData.questionPaperData}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="examDetails">Exam Details:</label>
                    <textarea
                        id="examDetails"
                        name="examDetails"
                        value={examData.examDetails}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button type="submit">Create Exam</button>
            </form>

            {response && (
                <div className="success-message">
                    <h3>Exam Created Successfully!</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <h3>Error Creating Exam</h3>
                    <p>{error}</p>
                </div>
            )}

            <ClassList/>
        </div>
    );
};

export default CreateExam;
