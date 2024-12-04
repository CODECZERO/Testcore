import React, { useState } from 'react';

interface ConnectChatProps {
  userId: string;
  setRoomName: (roomName: string) => void; // Callback to set room name on success
}

const ConnectChat: React.FC<ConnectChatProps> = ({ userId, setRoomName }) => {
  const [college, setCollege] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle the connection to the chat room
  const connectChatHandler = async () => {
    if (!college || !branch) {
      setError('Please provide both College and Branch.');
      return;
    }

    setIsLoading(true);  // Set loading state to true while awaiting response
    setError('');  // Clear any previous errors

    try {
      // Sending POST request to connect to the chat room
      const response = await fetch(`https://your-api-url/connectChat/${college}/${branch}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Include the userId in the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to connect to the chat room');
        return;
      }

      const data = await response.json();

      // On success, set the room name and store the token
      if (data && data.data) {
        setRoomName(data.data.roomName);  // Update the room name in the parent component
        const token = data.token;  // This should be part of the response (sent as cookie or in response body)

        // You can store the token in localStorage or use it for WebSocket connection
        localStorage.setItem('chatToken', token);
        // Optionally, start the WebSocket connection here, passing the token for authentication
        startWebSocketConnection(token);
      }
    } catch (err) {
      setError('An error occurred while connecting to the chat room.');
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);  // Set loading state to false after the request is completed
    }
  };

  // Start WebSocket connection after successful authentication
  const startWebSocketConnection = (token: string) => {
    const socket = new WebSocket('wss://your-websocket-url');  // Adjust WebSocket URL

    socket.onopen = () => {
      console.log('WebSocket connection established');
      // Send token over WebSocket for authorization
      socket.send(JSON.stringify({ type: 'authenticate', token }));
    };

    socket.onmessage = (event) => {
      console.log('Message from WebSocket:', event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  return (
    <div className="connect-chat">
      <h2>Connect to Chat Room</h2>
      <input
        type="text"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
        placeholder="Enter College Name"
      />
      <input
        type="text"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        placeholder="Enter Branch Name"
      />
      <button onClick={connectChatHandler} disabled={isLoading}>
        {isLoading ? 'Connecting...' : 'Join Chat'}
      </button>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ConnectChat;
