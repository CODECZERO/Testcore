import React, { useState } from "react";
import axios from "axios";
import { useRoom } from "./RoomContext"; // Import RoomContext for global room management
import "./styles2/JoinChat.css"

const BackendUrl = "https://testcore-qmyu.onrender.com";
const authToken = localStorage.getItem("accessToken");

interface JoinChatProps {
  onRoomJoin?: (roomName: string) => void; // Optional callback for parent components
}

const JoinChat: React.FC<JoinChatProps> = ({ onRoomJoin }) => {
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [feedback, setFeedback] = useState("");
  const { setRoomName } = useRoom(); // Get the global setRoomName function from context

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const roomName = `${college}/${branch}`; // Create the room name from input values

    try {
      const response = await axios.post(
        `${BackendUrl}/api/v1/chat/ChatQuery/${roomName}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setRoomName(roomName); // Update the global room name in the context
      if (onRoomJoin) onRoomJoin(roomName); // Notify parent component if callback is provided

      console.log("Room Joined in joinchat component:", roomName);
      setFeedback(response.data.message || "Joined room successfully");
    } catch (error: any) {
      setFeedback(error.response?.data?.message || "Error while joining room");
    }
  };

  

  return (
   <>
   
   </>
  );
};

export default JoinChat;
