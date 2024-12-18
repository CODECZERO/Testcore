import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./store";

const RestoreUser: React.FC = () => {
  const dispatch = useDispatch();
 

  useEffect(() => {
    // Retrieve user session data from localStorage
    const accessToken = localStorage.getItem("accessToken");
    const tabId = window.name; // Get the current tab's ID
    const userId = localStorage.getItem(`userId_${tabId}`) || '';
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");
    const userPhone = localStorage.getItem("userPhone");
    const userAddress = localStorage.getItem("userAddress");



    if (accessToken && userId && userRole) {
      // Construct the user data object
      const userdata = {
        name: userName || "Unknown User",
        email: userEmail || "unknown@example.com",
        image: "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg",
        role: userRole,
        phone: userPhone,
        address: userAddress,
      };

      // Restore user state in Redux
      dispatch(login(userdata));
    } 
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default RestoreUser;
