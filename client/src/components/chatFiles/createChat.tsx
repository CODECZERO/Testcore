import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";

const BackendUrl = "https://testcore-qmyu.onrender.com";
const authToken = localStorage.getItem("accessToken");



const CreateChat: React.FC = () => {
    const [roomName, setRoomName] = useState("");

    

    const handleCreateRoom = async () => {
        if (!roomName) {
            alert("Room name cannot be empty!");
            return;
        }
        try {
            const response = await axios.post(
                `${BackendUrl}/api/v1/chat/createChat`,
                { roomName },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            localStorage.setItem("roomName", roomName); 
            alert("Chat room created successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Error creating chat room:", error);
            alert("Failed to create chat room.");
        }
    };

    return (
        <div>
            <TextField
                label="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                fullWidth
                required
            />
            <Button variant="contained" color="primary" onClick={handleCreateRoom}>
                Create Room
            </Button>
        </div>
    );
};

export default CreateChat;
