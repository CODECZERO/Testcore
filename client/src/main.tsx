import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './components/store';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './components/queryClient';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignIn from './components/LoginSign/SignIn.tsx';
import Dashboard from './components/DashBoard/Dashboard.tsx';
import FrontPage from './components/LoginSign/FrontPage.tsx';
import Login from './components/LoginSign/SignUp.tsx';
import Help from './components/DashBoard/Help.tsx';
import SessionCheck from './components/SessionCheck.tsx';
import './App.css'
import Chat from './components/chatFiles/Chat.tsx';
import { ChatWrapper } from "./components/chatFiles/ChatWrapper.tsx";
import RestoreUser from './components/RestoreUser.tsx';
import { RoomProvider } from './components/chatFiles/RoomContext.tsx';
import CreateTimetable from './components/ExaminerFunctions/CreateTimeTable.tsx';
import CreateExam from './components/ExaminerFunctions/CreateExam.tsx';
import ForgetPassword from './components/LoginSign/ForgetPassword.tsx';
import ProfileAccount from './components/DashBoard/ProfileAccount.tsx';
import { ProfilePictureProvider } from './components/Users/ProfileContext.tsx';
import CollegeStudents from './components/College/CollegeStudents.tsx';
import ExamParticipants from './components/ExaminerFunctions/ExamParticipants.tsx';
import AccessDenied from './components/Auth/AccessDenied.tsx';
import { ToastProvider } from './components/UI/Toast';




// Browser router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <FrontPage />,
  },
  {
    path: "/sessioncheck",
    element: <SessionCheck />, // Handles session validation (similar to the isAuthenticated check)
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/Dash-Board",
    element: <Dashboard />,
  },
  {
    path: "/sign-up",
    element: <Login />,
  },
  {
    path: "/messages",
    element: <Chat />,
  },

  {
    path: "/create-timetable",
    element: <CreateTimetable />,
  },

  {
    path: "/Help",
    element: <Help />,
  },
  {
    path: "/CreateExam",
    element: <CreateExam />,
  },
  {
    path: "/Profileaccount",
    element: <ProfileAccount />,
  },
  {
    path: "/CollegeStudents",
    element: <CollegeStudents />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/exam-participants",
    element: <ExamParticipants />,
  },
  {
    path: "/access-denied",
    element: <AccessDenied />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ProfilePictureProvider>
            <RoomProvider>
              <ChatWrapper>
                <RouterProvider router={router} />
                <RestoreUser />
              </ChatWrapper>
            </RoomProvider>
          </ProfilePictureProvider>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
