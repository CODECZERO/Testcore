// FrontPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import  './frontpage.css';



const FrontPage: React.FC = () => {
  
  return (
    <div className="front-page">
      <h1>Welcome to Our Application</h1>
      <div className="button-container">
        <Link to="/sign-in" className="button">
          Sign In
        </Link>
        <Link to="/sign-up" className="button">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default FrontPage;
