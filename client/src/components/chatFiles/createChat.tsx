import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useRoom } from "./RoomContext";
import apiClient, { getErrorMessage } from "../../services/api.service";
import { API_ENDPOINTS } from "../../config/api.config";

const CreateChat: React.FC = () => {
  const [roomName, setRoomNameInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { setRoomName } = useRoom();

  const handleCreateRoom = async () => {
    if (!roomName) {
      alert("Room name cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT.CREATE, { roomName });
      setRoomName(roomName);
      alert("Chat room created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating chat room:", error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TextField
        label="Room Name"
        value={roomName}
        onChange={(e) => setRoomNameInput(e.target.value)}
        fullWidth
        required
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateRoom}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Room"}
      </Button>
    </div>
  );
};

export default CreateChat;
