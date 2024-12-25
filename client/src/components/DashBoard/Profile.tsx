import React, { useState } from "react";
import "../styles/Profile.css"; // Import styles for animation and layout
import Pic from "../../Assets/Pic.png"; // Profile placeholder
import Radio from "./Radio";

const Profile: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Manage menu visibility
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the dropdown menu
  };

  return (
    <div className="profile-container">
      <div
        className={`profile-avatar ${menuOpen ? "menu-open" : ""}`} // Add 'menu-open' class when menu is open
        onClick={toggleMenu}
      >
        <img src={Pic} alt="Profile Avatar" />
      </div>
      {menuOpen && (
        <div className="dropdown-menu">
          <Radio />
        </div>
      )}
    </div>
  );
};

export default Profile;
