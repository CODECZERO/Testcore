// API Configuration
export const API_BASE_URL = "https://testcore-3en7.onrender.com";

export const API_ENDPOINTS = {
    // User routes
    USER: {
        SIGNUP: "/api/v1/user/signup",
        LOGIN: "/api/v1/user/login",
        USER_DATA: "/api/v1/user/userData",
        CLASS: "/api/v1/user/class",
        PROFILE: "/api/v1/user/profile",
    },
    // Examiner routes
    EXAMINER: {
        SCHEDULE_EXAM: "/api/v1/examiner/scheuldeExam",
        QUESTION_PAPER: "/api/v1/examiner/questionPaper",
        AFTER_EXAM: "/api/v1/examiner/afterExam",
        EXAM: "/api/v1/examiner/exam",
        TIMETABLE: "/api/v1/examiner/timeTable",
    },
    // Student routes
    STUDENT: {
        EXAM: "/api/v1/student/Exam",
        TIMETABLE: "/api/v1/student/TimeTable",
        RESULT: "/api/v1/student/Result",
        QUESTION: "/api/v1/student/Question",
    },
    // College routes
    COLLEGE: {
        SUBJECT: "/api/v1/college/subject",
        CREATE_SUBJECT: "/api/v1/college/createSubject",
        STUDENT: "/api/v1/college/student",
        EXAMINER: "/api/v1/college/examiner",
    },
    // Chat routes
    CHAT: {
        CREATE: "/api/v1/chat/createChat",
        GET_CHATS: "/api/v1/chat/getChat",
        CHAT_QUERY: (roomName: string) => `/api/v1/chat/ChatQuery/${roomName}`,
        CONNECT: (roomName: string) => `/api/v1/chat/connectChat/${roomName}`,
    },
    // Notification routes
    NOTIFICATION: {
        SEND: "/api/v1/notification/sendNotification",
    },
};

// Helper to get full URL
export const getApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
};
