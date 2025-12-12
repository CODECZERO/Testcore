import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, roleConfig } from '../../config/permissions.config';
import '../styles/AccessDenied.css';

/**
 * AccessDenied - Friendly page shown when user attempts to access unauthorized route
 */
const AccessDenied: React.FC = () => {
    const navigate = useNavigate();
    const userRole = getUserRole();
    const roleInfo = userRole ? roleConfig[userRole] : null;

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/Dash-Board');
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate('/sign-up');
    };

    return (
        <div className="access-denied-container">
            <div className="access-denied-card">
                <div className="access-denied-icon">🔒</div>
                <h1>Access Denied</h1>
                <p className="access-denied-message">
                    You don't have permission to access this page.
                </p>

                {roleInfo && (
                    <div
                        className="role-badge"
                        style={{ backgroundColor: roleInfo.bgColor, color: roleInfo.color }}
                    >
                        Your role: <strong>{roleInfo.label}</strong>
                    </div>
                )}

                <p className="access-denied-hint">
                    If you believe this is an error, please contact your administrator.
                </p>

                <div className="access-denied-actions">
                    <button onClick={handleGoBack} className="btn-secondary">
                        ← Go Back
                    </button>
                    <button onClick={handleGoHome} className="btn-primary">
                        Go to Dashboard
                    </button>
                </div>

                <button onClick={handleLogout} className="btn-logout">
                    Sign in with different account
                </button>
            </div>
        </div>
    );
};

export default AccessDenied;
