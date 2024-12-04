import React, { useEffect, useState } from 'react';
import ContentHeader from './ContentHeader';
import '../styles/content.css';
import Card from './Card';
import { BiBookAlt, BiMessage, BiStats } from 'react-icons/bi';

const Content: React.FC = () => {
  // Get the user's role from localStorage or Redux
  const userRole = localStorage.getItem('userRole'); // Assuming user role is stored in localStorage

  const [cardsToDisplay, setCardsToDisplay] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Logic to display cards based on user role
    switch (userRole) {
      case 'Student':
        setCardsToDisplay([
          <Card
            key="stats"
            title="Stats"
            description="View all your stats and progress in one place."
            icon={<BiStats />}
          />,
          <Card
            key="messages"
            title="Messages"
            description="Check and reply to all your messages easily."
            icon={<BiMessage />}
          />,
          <Card
            key="assignments"
            title="Assignments"
            description="Keep track of your assignments and deadlines."
            icon={<BiBookAlt />}
          />,
        ]);
        break;

      case 'College':
        setCardsToDisplay([
          <Card
            key="assignments"
            title="Assignments"
            description="Manage assignments and deadlines for students."
            icon={<BiBookAlt />}
          />,
          <Card
            key="messages"
            title="Messages"
            description="Communicate with students and staff."
            icon={<BiMessage />}
          />,
        ]);
        break;

      case 'Examiner':
        setCardsToDisplay([
          <Card
            key="Timetable"
            title="Make TimeTable"
            description="Make timetable here."
            icon={<BiStats />}
          />,
          <Card
            key="Take Exam"
            title="Exam"
            description="Make a Exam for Student"
            icon={<BiMessage />}
          />,
        ]);
        break;

      default:
        setCardsToDisplay([]);
    }
  }, [userRole]);

  return (
    <div className="content-container">
      <ContentHeader />

      {/* Render the cards based on the role */}
      <div className="cards-grid">
        {cardsToDisplay}
      </div>
    </div>
  );
};

export default Content;


