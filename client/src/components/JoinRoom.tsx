import React, { useState } from 'react';

interface JoinRoomProps {
  setRoomName: (roomName: string) => void;
  userId: string;
  college: string; // New prop for college
  branch: string;  // New prop for branch
}

const JoinRoom: React.FC<JoinRoomProps> = ({ setRoomName, userId, college, branch }) => {
  const [roomNameInput, setRoomNameInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const joinRoomHandler = async () => {
    if (!roomNameInput.trim()) {
      setError('Room name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('accesToken');
      if (!token) {
        console.error('Access token is missing. Cannot join a room.');
        return;
      }

      // Dynamically construct the URL with college and branch
      const apiUrl = `https://testcore-qmyu.onrender.com/api/v1/chat/ChatQuery/${college}/${branch}`;

      // API call to join chat room
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          roomName: roomNameInput,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // If the room is joined successfully, update the roomName in the parent Chat component
        setRoomName(roomNameInput);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to join the room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setError('An error occurred while joining the room');
    }
  };

  return (
    <div className="join-room">
      <input
        type="text"
        value={roomNameInput}
        onChange={(e) => setRoomNameInput(e.target.value)}
        placeholder="Enter Room Name"
      />
      <button onClick={joinRoomHandler}>Join Room</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default JoinRoom;
