// Import necessary libraries and modules
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';


const BackendUrl = "https://testcore-qmyu.onrender.com";

const CreateExam: React.FC = () => {
    // State to store input data and feedback
    const [examData, setExamData] = useState({
        questionPaperData: '',
        examDetails: ''
    });
    const [response, setResponse] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExamData({ ...examData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setResponse(null);

        try {
            const res = await axios.post(`${BackendUrl}/api/exam/question-paper`, {
                questionPaperData: examData.questionPaperData,
                examData: examData.examDetails
            });

            if (res.status === 201) {
                setResponse(res.data);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // Server responded with a status other than 200 range
                    setError(err.response.data);
                } else if (err.request) {
                    // Request was made but no response received
                    setError('No response from server. Please try again later.');
                } else {
                    // Something happened while setting up the request
                    setError('Error: ' + err.message);
                }
            } else {
                setError('An unknown error occurred.');
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
        </div>
    );
};

export default CreateExam;
