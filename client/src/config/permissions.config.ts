// Permission configuration for role-based access control

export type UserRole = 'Student' | 'College' | 'Examiner' | null;

export interface Permission {
    canAccess: boolean;
    redirectTo?: string;
}

// Define which routes each role can access
export const rolePermissions: Record<string, UserRole[]> = {
    // Public routes
    '/': ['Student', 'College', 'Examiner', null],
    '/sign-up': [null],
    '/sign-in': [null],
    '/forget-password': ['Student', 'College', 'Examiner', null],

    // Protected routes - all authenticated users
    '/Dash-Board': ['Student', 'College', 'Examiner'],
    '/messages': ['Student', 'College', 'Examiner'],
    '/Help': ['Student', 'College', 'Examiner'],
    '/Profileaccount': ['Student', 'College', 'Examiner'],

    // Student-only routes
    '/get-exam': ['Student'],
    '/timetable': ['Student'],
    '/results': ['Student'],

    // Examiner-only routes
    '/create-timetable': ['Examiner'],
    '/CreateExam': ['Examiner'],
    '/exam-participants': ['Examiner'],
    '/schedule-exam': ['Examiner'],

    // College-only routes
    '/CollegeStudents': ['College'],
    '/college-examiners': ['College'],
    '/approve-timetable': ['College'],
};

// Define menu items per role
export interface MenuItem {
    path: string;
    label: string;
    icon: string; // Icon name from react-icons/bi
}

export const roleMenus: Record<UserRole & string, MenuItem[]> = {
    Student: [
        { path: '/Dash-Board', label: 'Dashboard', icon: 'BiHome' },
        { path: '/timetable', label: 'Timetable', icon: 'BiCalendar' },
        { path: '/get-exam', label: 'My Exams', icon: 'BiBookAlt' },
        { path: '/results', label: 'Results', icon: 'BiStats' },
        { path: '/messages', label: 'Messages', icon: 'BiMessage' },
        { path: '/Help', label: 'Help', icon: 'BiHelpCircle' },
    ],
    College: [
        { path: '/Dash-Board', label: 'Dashboard', icon: 'BiHome' },
        { path: '/CollegeStudents', label: 'Students', icon: 'BiGroup' },
        { path: '/college-examiners', label: 'Examiners', icon: 'BiUserCheck' },
        { path: '/approve-timetable', label: 'Timetables', icon: 'BiCalendarCheck' },
        { path: '/messages', label: 'Messages', icon: 'BiMessage' },
        { path: '/Help', label: 'Help', icon: 'BiHelpCircle' },
    ],
    Examiner: [
        { path: '/Dash-Board', label: 'Dashboard', icon: 'BiHome' },
        { path: '/schedule-exam', label: 'Schedule Exam', icon: 'BiCalendarPlus' },
        { path: '/CreateExam', label: 'Question Papers', icon: 'BiEdit' },
        { path: '/exam-participants', label: 'Participants', icon: 'BiGroup' },
        { path: '/create-timetable', label: 'Create Timetable', icon: 'BiTable' },
        { path: '/messages', label: 'Messages', icon: 'BiMessage' },
        { path: '/Help', label: 'Help', icon: 'BiHelpCircle' },
    ],
};

// Utility functions
export const getUserRole = (): UserRole => {
    const role = localStorage.getItem('userRole');
    if (role === 'Student' || role === 'College' || role === 'Examiner') {
        return role;
    }
    return null;
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('accessToken');
};

export const canAccessRoute = (route: string, userRole: UserRole): Permission => {
    const allowedRoles = rolePermissions[route];

    // Route not in permissions list - default to requiring auth
    if (!allowedRoles) {
        return {
            canAccess: isAuthenticated(),
            redirectTo: isAuthenticated() ? '/Dash-Board' : '/sign-up'
        };
    }

    // Check if user's role is allowed
    if (allowedRoles.includes(userRole)) {
        return { canAccess: true };
    }

    // Not allowed - redirect based on auth status
    return {
        canAccess: false,
        redirectTo: isAuthenticated() ? '/Dash-Board' : '/sign-up'
    };
};

export const getMenuForRole = (role: UserRole): MenuItem[] => {
    if (!role) return [];
    return roleMenus[role] || [];
};

// Role display names and colors
export const roleConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    Student: { label: 'Student', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.1)' },
    College: { label: 'College Admin', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.1)' },
    Examiner: { label: 'Examiner', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.1)' },
};
