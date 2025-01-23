import React from "react";
import Pic from "../../Assets/Pic.png";
import { BiPlus } from "react-icons/bi";
import { useProfilePicture } from "../Users/ProfileContext";
import "../styles/ProfileAccount.css";

const ProfileAccount: React.FC = () => {
  const { handleFileChange, handleUpload } = useProfilePicture();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id="roots">
      <div className="main-contentss">
        <div className="headerss">
          <h1>Profile Account</h1>
        </div>
        <div className="contentss">
          <div className="profile-sectionss">
            <div className="avatar-container">
              <img src={Pic} alt="Avatar" className="avatar" />
              <BiPlus className="plus-icon" onClick={triggerFileInput} />
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <button className="edit-username-btn" onClick={handleUpload}>
              Save Profile Picture
            </button>
          </div>
          <div className="other-options">
            <button>Change Password</button>
            <button>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAccount;
