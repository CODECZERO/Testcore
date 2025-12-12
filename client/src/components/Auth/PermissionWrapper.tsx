import React from 'react';
import { getUserRole, UserRole } from '../../config/permissions.config';

interface PermissionWrapperProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallback?: React.ReactNode;
}

/**
 * PermissionWrapper - Conditionally render children based on user role
 * 
 * Use this to show/hide UI elements based on user permissions.
 * For UX only - backend still enforces actual permissions.
 */
const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
    children,
    allowedRoles,
    fallback = null
}) => {
    const userRole = getUserRole();

    // Check if user's role is in the allowed list
    if (userRole && allowedRoles.includes(userRole)) {
        return <>{children}</>;
    }

    // Return fallback (default: nothing)
    return <>{fallback}</>;
};

export default PermissionWrapper;
