import React, { useEffect, useState } from 'react';
import ContentHeader from './ContentHeader';
import '../styles/content.css';
import Card from '../Card';
import { BiBookAlt, BiMessage, BiStats } from 'react-icons/bi';
import TimeTablePopup from '../StudentFunctions/TimeTable';
import GetExam from '../StudentFunctions/GetExam';

const Content: React.FC = () => {
  // Get the user's role from localStorage or Redux
  const userRole = localStorage.getItem('userRole'); // Assuming user role is stored in localStorage

  const [cardsToDisplay, setCardsToDisplay] = useState<JSX.Element[]>([]);
  const [isTimeTablePopupOpen, setIsTimeTablePopupOpen] = useState(false);
  const [isGetExamOpen, setIsGetExamOpen] = useState<boolean>(false);

  const openTimeTablePopup = () => setIsTimeTablePopupOpen(true);
  const closeTimeTablePopup = () => setIsTimeTablePopupOpen(false);

  useEffect(() => {
    // Logic to display cards based on user role
    switch (userRole) {
      case 'Student':
        setCardsToDisplay([
          <Card
            key="TimeTable"
            title="TimeTable"
            description="View all your TimeTable."
            icon={<BiStats />}
            onClick={openTimeTablePopup}
          />,
          <Card
            key="messages"
            title="Messages"
            description="Check and reply to all your messages easily."
            icon={<BiMessage />}
          />,
          <Card
            key="Get Exams"
            title="Exams"
            description="View all your Exams."
            icon={<BiBookAlt />}
            onClick={() => setIsGetExamOpen(true)}
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
      <TimeTablePopup
        isOpen={isTimeTablePopupOpen}
        onClose={closeTimeTablePopup}
      />
      <GetExam  isOpen={isGetExamOpen}
        onClose={() => setIsGetExamOpen(false)}/>
    </div>
  );
};

export default Content;


