import React from "react";
import { useProfilePicture } from "./ProfileContext";

const ProfilePictureUpload: React.FC = () => {
  const { handleFileChange, handleUpload, uploading, uploadError } = useProfilePicture();

  return (
    <div className="profile-picture-upload">
      <h2>Upload Profile Picture</h2>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadError && <p className="error-message">{uploadError}</p>}
    </div>
  );
};

export default ProfilePictureUpload;
