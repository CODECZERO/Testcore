import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import FrontPage from './components/FrontPage';
import Dashboard from './components/Dashboard.tsx'



  const router = createBrowserRouter([
    {
      path: "/",
      element: <FrontPage />
    },
    {
      path: "/sign-in",
      element: <SignIn/>
    },
    {
      path: "/sign-up",
      element: <SignUp/>
    },
    {
      path: "/Dash-Board",
      element: <Dashboard/>
    },
  ])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <RouterProvider router={router} />

    <App />
  </React.StrictMode>,
)
