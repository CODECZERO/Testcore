

import React, { useState, useEffect } from 'react';
import './styles/Front.css';  // Import the CSS file for styles
import { useNavigate } from 'react-router-dom';
const FrontPage: React.FC = () => {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate(); 
  // Trigger the animation and button visibility after the component mounts
  useEffect(() => {
    setTimeout(() => setShowButtons(true), 2000);  // Show buttons after animation completes
  }, []);

  const handleLoginClick = () => {
    navigate('/sign-up');  // Navigate to the login page
  };

  const handleSignUpClick = () => {
    navigate('/sign-in');  // Navigate to the sign-up page
  };
  return (
    <div className="full-page">
      <div className='container'></div>
      <div className="logo-animation">
      </div>

      <span className="logo-bottom-text">AG</span>
      <span className="bottom-text">Comes in with Some Glitches</span>

      {showButtons && (
        <div className="button-container">
          <button className="login-button" onClick={handleLoginClick}>Log In</button>
          <button className="signup-button" onClick={handleSignUpClick}>Sign Up</button>
        </div>
      )}
    </div>
    

    
  );
};

export default FrontPage;