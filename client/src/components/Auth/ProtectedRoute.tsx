import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { canAccessRoute, getUserRole } from '../../config/permissions.config';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

/**
 * ProtectedRoute - Wrapper component for role-based route protection
 * 
 * Checks if user is authenticated and has permission to access the route.
 * Redirects to appropriate page if access is denied.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
    const location = useLocation();
    const userRole = getUserRole();

    // Check route-based permissions
    const permission = canAccessRoute(location.pathname, userRole);

    // If specific roles required, check against those
    if (requiredRoles && requiredRoles.length > 0) {
        if (!userRole || !requiredRoles.includes(userRole)) {
            return <Navigate to="/access-denied" state={{ from: location }} replace />;
        }
    }

    // Check general route access
    if (!permission.canAccess) {
        return <Navigate to={permission.redirectTo || '/sign-up'} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
