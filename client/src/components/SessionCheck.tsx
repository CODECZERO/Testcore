import React, { useEffect, useState } from 'react'
import Login from './LoginSign/SignUp';
import Dashboard from './DashBoard/Dashboard';
import apiClient from '../services/api.service';
import { API_ENDPOINTS } from '../config/api.config';

const SessionCheck: React.FC = () => {
    const [loginData, setLoginData] = useState<any>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await apiClient.get(API_ENDPOINTS.USER.USER_DATA);
                if (response.data) {
                    setLoginData(response.data);
                } else {
                    setLoginData(false);
                }
            } catch {
                setLoginData(false);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    if (loading) return null;

    return !loginData ? (
        <Login />
    ) : (
        <>
            <Dashboard />
        </>
    );
};

export default SessionCheck;
