import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ContentHeader from './ContentHeader';
import '../styles/content.css';
import Card from '../Card';
import { BiBookAlt, BiMessage, BiStats } from 'react-icons/bi';
import TimeTablePopup from '../StudentFunctions/TimeTable';
import GetExam from '../StudentFunctions/GetExam';
import Schedule from '../ExaminerFunctions/Schedule';
import ClassList from '../ExaminerFunctions/ClassList';
import CreateClass from '../ExaminerFunctions/CreateClass';

const Content: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigation hook
  const userRole = localStorage.getItem('userRole'); // Assuming user role is stored in localStorage

  const [cardsToDisplay, setCardsToDisplay] = useState<JSX.Element[]>([]);
  const [isTimeTablePopupOpen, setIsTimeTablePopupOpen] = useState(false);
  const [isExamSchedulerOpen, setIsExamSchedulerOpen] = useState(false);
  const [isGetExamOpen, setIsGetExamOpen] = useState<boolean>(false);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState<boolean>(false);


  const openTimeTablePopup = () => setIsTimeTablePopupOpen(true);
  const closeTimeTablePopup = () => setIsTimeTablePopupOpen(false);

  const openExamScheuler = () => setIsExamSchedulerOpen(true);
  const closeExamScheuler = () => setIsExamSchedulerOpen(false);

  const openCreateClass = () => setIsCreateClassOpen(true);
  const closeCreateClass = () => setIsCreateClassOpen(false);

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
            key="Examiner and Students"
            title="Examiner and Students"
            description="Manage Examiner and Students for students."
            icon={<BiBookAlt />}
            onClick={() => navigate('/CollegeStudents')} 
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
            onClick={() => navigate('/create-timetable')} // Navigate to /create-timetable
          />,
          <Card
            key="Schedule Exam"
            title="Schedule Exam"
            description="Schedule an Exam for Students"
            icon={<BiMessage />}
            onClick={openExamScheuler}
          />,
          <Card
            key="Create Exam"
            title="Create Exam"
            description="Create an Exam for Students"
            icon={<BiMessage />}
            onClick={() => navigate('/CreateExam')}
           
          />,
          <Card
            key="Create Class"
            title="Create Class"
            description="Create an Class for Students"
            icon={<BiMessage />}
            onClick={openCreateClass}
          />,
        ]);
        break;

      default:
        setCardsToDisplay([]);
    }
  }, [userRole, navigate]);

  return (
    <>
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
      <GetExam
        isOpen={isGetExamOpen}
        onClose={() => setIsGetExamOpen(false)}
      />

      <Schedule 
        isOpen={isExamSchedulerOpen}
        onClose={closeExamScheuler}
      />

      <CreateClass
         isOpen={isCreateClassOpen}
        onClose={closeCreateClass}
      />
      
  

    </div>
    </>
  );
};

export default Content;
