import React, { useState } from "react";
import { useRoom } from "./RoomContext";
import apiClient, { getErrorMessage } from "../../services/api.service";
import { API_ENDPOINTS } from "../../config/api.config";
import "./styles2/JoinChat.css"

interface JoinChatProps {
  onRoomJoin?: (roomName: string) => void;
}

const JoinChat: React.FC<JoinChatProps> = ({ onRoomJoin }) => {
  const [roomName, setRoomName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { setRoomName: setGlobalRoomName } = useRoom();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setFeedback("Please enter a room name");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT.CHAT_QUERY(roomName), {});

      setGlobalRoomName(roomName);
      if (onRoomJoin) onRoomJoin(roomName);

      console.log("Room Joined in joinchat component:", roomName);
      setFeedback(response.data.message || "Joined room successfully");
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-chat-container">
      <form onSubmit={handleJoin} className="join-chat-form">
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="join-chat-input"
        />
        <button type="submit" disabled={loading} className="join-chat-button">
          {loading ? "Joining..." : "Join Room"}
        </button>
      </form>
      {feedback && <p className="join-chat-feedback">{feedback}</p>}
    </div>
  );
};

export default JoinChat;
