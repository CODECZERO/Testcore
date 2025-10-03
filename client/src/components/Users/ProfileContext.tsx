import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ProfilePictureContext = createContext<any>(null);

const BackendUrl = "https://testcore-3en7.onrender.com";

interface ProfilePictureProviderProps {
  children: React.ReactNode;
}

export const ProfilePictureProvider: React.FC<ProfilePictureProviderProps> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      console.log("File selected:", file);
    }
  };

  // Function to upload the selected file
  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      setUploadError("Please select a file before uploading.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("ProfileImage", selectedFile);

      const accessToken = localStorage.getItem("accessToken");
      console.log("accessToken", accessToken);
      if (!accessToken) {
        setUploadError("User not authorized. Please log in.");
        return;
      }
      
        console.log("Selected file details:", {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
        });

      const response = await axios.post(`${BackendUrl}/api/v1/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`, // Include the access token
        },
      });

      console.log("Profile picture uploaded successfully:", response.data);
      alert("Profile picture updated successfully!");
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      if (error.response) {
        console.log("Backend error response:", error.response.data);
      }
      if (error.response) {
        setUploadError(error.response.data.message || "Failed to upload profile picture.");
        
      } else {
          
        setUploadError("An unexpected error occurred.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProfilePictureContext.Provider value={{ handleFileChange, handleUpload, uploading, uploadError }}>
      {children}
    </ProfilePictureContext.Provider>
  );
};

export const useProfilePicture = () => useContext(ProfilePictureContext);
