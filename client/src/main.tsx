// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { store } from './components/store';
// import { QueryClientProvider } from 'react-query';
// import { queryClient } from './components/queryClient';
// import './index.css';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import SignIn from './components/SignIn';
// import Dashboard from './components/Dashboard.tsx';
// import FrontPage from './components/FrontPage.tsx';
// import Login from './components/SignUp.tsx';
// import Help from './components/Help.tsx';
// import SessionCheck from './components/SessionCheck.tsx';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import './App.css'
// import Chat from './components/Chat.tsx';
// import { ChatWrapper } from "./components/chatFiles/ChatWrapper.tsx";




// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//     background: {
//       default: '#121212', // Dark background color
//       paper: '#1e1e1e',
//     },
//     text: {
//       primary: '#ffffff', // Primary text color
//       secondary: '#b0b0b0', // Secondary text color
//     },
//   },
// });

// // Browser router setup
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <FrontPage />,
//   },
//   {
//     path: "/sessioncheck",
//     element: <SessionCheck />, // Handles session validation (similar to the isAuthenticated check)
//   },
//   {
//     path: "/sign-in",
//     element: <SignIn />,
//   },
//   {
//     path: "/Dash-Board",
//     element: <Dashboard />,
//   },
//   {
//     path: "/sign-up",
//     element: <Login />,
//   },
//   {
//     path: "/messages",
//     element: <Chat />,
//   },
//   {
//     path: "/Help",
//     element: <Help />,
//   },
// ]);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <QueryClientProvider client={queryClient}>
//         <ThemeProvider theme={darkTheme}>
//           {/* RouterProvider now includes the router */}
//           <ChatWrapper>
//             <RouterProvider router={router} />
//           </ChatWrapper>

//         </ThemeProvider>
//       </QueryClientProvider>
//     </Provider>
//   </React.StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './components/store';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './components/queryClient';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard.tsx';
import FrontPage from './components/FrontPage.tsx';
import Login from './components/SignUp.tsx';
import Help from './components/Help.tsx';
import SessionCheck from './components/SessionCheck.tsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'
import Chat from './components/Chat.tsx';
import { ChatWrapper } from "./components/chatFiles/ChatWrapper.tsx";
import Modal from 'react-modal'; // Import Modal
import TimeTablePopup from './components/StudentFunctions/TimeTable.tsx';

// Ensure Modal is accessible by linking to the root element
Modal.setAppElement('#root');

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: '#121212', // Dark background color
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff', // Primary text color
      secondary: '#b0b0b0', // Secondary text color
    },
  },
});

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
    path: "/Help",
    element: <Help />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          {/* RouterProvider now includes the router */}
          <ChatWrapper>
            <RouterProvider router={router} />
          </ChatWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
