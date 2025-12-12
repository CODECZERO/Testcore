import React from 'react';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { getUserRole, roleConfig } from '../../config/permissions.config';
import "../styles/contentheader.css";

// Role-specific greetings and tips
const roleGreetings: Record<string, { title: string; subtitle: string }> = {
  Student: {
    title: "Ready to learn?",
    subtitle: "Check your upcoming exams and timetable"
  },
  College: {
    title: "Administration Dashboard",
    subtitle: "Manage students, examiners, and timetables"
  },
  Examiner: {
    title: "Exam Management",
    subtitle: "Schedule exams and manage question papers"
  }
};

const ContentHeader: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userRole = getUserRole();
  const roleInfo = userRole ? roleConfig[userRole] : null;
  const greeting = userRole ? roleGreetings[userRole] : null;

  // Get time-based greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className='content--header'>
      <div className="header--main">
        <h1 className="header--title">
          <span className="headss">{getTimeGreeting()}, </span>
          <span id='username'>{userInfo?.name || 'User'}</span>
          {roleInfo && (
            <span
              className="role-badge-header"
              style={{
                backgroundColor: roleInfo.bgColor,
                color: roleInfo.color,
                marginLeft: '0.75rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                verticalAlign: 'middle'
              }}
            >
              {roleInfo.label}
            </span>
          )}
        </h1>
        {greeting && (
          <p className="header--subtitle" style={{
            color: '#666',
            marginTop: '0.25rem',
            fontSize: '0.9rem'
          }}>
            {greeting.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentHeader;
