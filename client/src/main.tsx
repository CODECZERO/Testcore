import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import FrontPage from './components/FrontPage';



  const router = createBrowserRouter([
    {
      path: "/",
      element: <FrontPage />, // Use FrontPage as the default route
    },
    {
      path: "/sign-in",
      element: <SignIn />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
  ]);
 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <RouterProvider router={router} />

    <App />
  </React.StrictMode>,
)
