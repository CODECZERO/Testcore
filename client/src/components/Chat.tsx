import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from './store'; // Adjust the path to your store file
import "../styles/Chat.css";

interface ChatMessage {
  MessageID: string;
  content: string;
  typeOfMessage: 'SEND_MESSAGE' | 'LEAVE_ROOM';
  userId: string;
  username: string;
  roomName: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('default_room');
  const [groups, setGroups] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [newRoomName, setNewRoomName] = useState<string>(''); // State for new room name input
  const [joinStatus, setJoinStatus] = useState<string>('');
  const [joinRoomName, setJoinRoomName] = useState<string>(''); 
  // Redux: Extract user information
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userId = localStorage.getItem('userId') || '';

  // Initialize WebSocket connection
  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('accesToken'); // Access token from localStorage
    if (!token) {
      console.error('Access token is missing. Cannot connect to WebSocket.');
      return;
    }

    console.log('Connecting to WebSocket with token:', token);
    const socketUrl = `wss://testcore-qmyu.onrender.com/ws1/?token=${token}`;
    const ws = new WebSocket(socketUrl);

    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established.');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const incomingMessage: ChatMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, incomingMessage]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  // Create Room functionality
  const createRoom = async () => {
    if (!newRoomName.trim()) {
      alert('Room name cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
      if (!token) {
        console.error('Access token is missing. Cannot create a room.');
        return;
      }

      const roomName = newRoomName; // Use the dynamic room name input

      const response = await fetch('https://testcore-qmyu.onrender.com/api/v1/chat/createChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
        body: JSON.stringify({
          roomName,
          userId: localStorage.getItem('userId'), // Replace with appropriate user ID
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error creating room:', errorText);
        alert('Failed to create room. Please try again.');
        return;
      }

      const data = await response.json();
      console.log('Room creation response:', data);

      if (data.statusCode === 200 && data.success) {
        const { roomName, AdminId } = data.data;
        setRoomName(roomName); // Update the UI with the created room name
        setGroups((prev) => [...prev, roomName]); // Add the new room to the groups list
        console.log(`Room "${roomName}" created successfully by Admin ${AdminId}!`);
        setNewRoomName(''); // Clear the input field after room creation

        // joinRoom(roomName);
      } else {
        console.error('Unexpected response format:', data);
        alert('Room creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('An unexpected error occurred while creating the room.');
    }
  };

  
// Join Room functionality
const joinRoom = async (room: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const joinMessage = {
      typeOfMessage: 'JOIN_ROOM',
      roomName: room, // Room to join
      userId,
    };
    socket.send(JSON.stringify(joinMessage)); // Notify server of room subscription
    setRoomName(room); // Update room name locally
  } else {
    console.error('WebSocket not connected. Cannot join room.');
  }
  try {
    const token = localStorage.getItem('accesToken');
    if (!token) {
      alert('Access token is missing.');
      return;
    }
   
    console.log("Roomname:",room)
    const response = await fetch(`https://testcore-qmyu.onrender.com/api/v1/chat/ChatQuery/${room}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: userId, roomName: room }),
    });

    console.log("Room",room);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error joining room:', errorText);
      setJoinStatus('Error joining room');
      return;
    }

    const data = await response.json();
    console.log('Room join response:', data);

    if (data.statusCode === 200 && data.success) {
      setJoinStatus('Successfully joined the room');
      setRoomName(room); // Update room name after joining
      // connectChat(room);
      console.log(`Joined Room: ${room}`)
    } else {
      setJoinStatus('Failed to join room');
      alert('Failed to join room. Please try again.');
    }
  } catch (error) {
    console.error('Error joining room:', error);
    alert('An error occurred while joining the room.');
  }
};




  // Load groups and friends
  useEffect(() => {
    const fetchGroupsAndFriends = async () => {
      // Mock API calls to fetch groups and friends (replace with real API calls)
      setGroups(['Group 1', 'Group 2', 'Group 3']);
      setFriends(['Friend 1', 'Friend 2', 'Friend 3']);
    };

    fetchGroupsAndFriends();
  }, []);

  // Send message through WebSocket
  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !currentMessage.trim()) {
      console.warn('Cannot send message: WebSocket not ready or message is empty.');
      return;
    }

    const message: ChatMessage = {
      MessageID: 'msg_' + new Date().getTime(),
      content: currentMessage,
      typeOfMessage: 'SEND_MESSAGE',
      userId,
      username: userInfo?.name || 'Unknown User',
      roomName,
    };

    socket.send(JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
    setCurrentMessage('');
  };

  // Auto-scroll to the latest message
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  return (
    <div className="chat-container">
      {/* Left Section: Groups and Friends */}
      <div className="chat-left">
        <h3>Groups</h3>
        <div className="group-list">
        <div>
  <h3>Join a Room</h3>
  <input
    type="text"
    value={joinRoomName}
    onChange={(e) => setJoinRoomName(e.target.value)}
    placeholder="Enter room name to join"
  />
  <button onClick={() => joinRoom(joinRoomName)}>Join Room</button>
  {joinStatus && <div>{joinStatus}</div>}
</div>

          {/* Input to create a dynamic room name */}
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter new room name"
          />
          <button onClick={createRoom}>Create Room</button>

          {groups.map((group) => (
            <div
              key={group}
              className="group-item"
              onClick={() => setRoomName(group)}
            >
              {group}
            </div>
          ))}
        </div>

        <h3>Friends</h3>
        <div className="friend-list">
          {friends.map((friend) => (
            <div key={friend} className="friend-item">
              {friend}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section: Chat */}
      <div className="chat-right">
        <h2 className="chat-title">Chat Room: {roomName}</h2>

        {/* Messages */}
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.MessageID}
              className={`message ${message.userId === userId ? 'outgoing' : 'incoming'}`}
            >
              <strong>{message.userId === userId ? 'You' : message.username}</strong>
              : {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="input-container">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;






//   // Connect Chat functionality
// const connectChat = async (room: string) => {
//   try {
//     const token = localStorage.getItem('accesToken');
//     if (!token) {
//       alert('Access token is missing.');
//       return;
//     }
   
//     const response = await fetch(`https://testcore-qmyu.onrender.com/api/v1/chat/connectChat/${room}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ userId: userId }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Error connecting to room:', errorText);
//       alert('Failed to connect to the room');
//       return;
//     }

//     const data = await response.json();
//     console.log('Connection response:', data);

//     if (data.statusCode === 200 && data.success) {
//       const token = data.data.token; // Extract token from response
//       localStorage.setItem('UserChatToken', token); // Store the token
//       console.log(`Successfully connected to the room! : ${room}`);
//     } else {
//       alert('Failed to connect to room.');
//     }
//   } catch (error) {
//     console.error('Error connecting to room:', error);
//     alert('An error occurred while connecting to the room.');
//   }
// };
