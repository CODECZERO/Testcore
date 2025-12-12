import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE_URL } from "../config/api.config";

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle common errors
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem("accessToken");
                    window.location.href = "/sign-up";
                    break;
                case 403:
                    console.error("Access forbidden");
                    break;
                case 404:
                    console.error("Resource not found");
                    break;
                case 500:
                    console.error("Server error");
                    break;
            }
        } else if (error.request) {
            console.error("Network error - no response received");
        }

        return Promise.reject(error);
    }
);

// API response type
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// Error response type
export interface ApiError {
    message: string;
    statusCode: number;
}

// Extract error message from error object
export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return (
            axiosError.response?.data?.message ||
            axiosError.message ||
            "An unexpected error occurred"
        );
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "An unexpected error occurred";
};

export default apiClient;
