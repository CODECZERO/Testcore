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
  const [createRoomName, setCreateRoomName] = useState<string>(''); // State for create room input
  const [joinRoomName, setJoinRoomName] = useState<string>(''); // State for join room input
  const [joinStatus, setJoinStatus] = useState<string>('');
  
  // Redux: Extract user information
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userId = localStorage.getItem('userId') || '';

  // Initialize WebSocket connection
  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('accessToken'); // Access token from localStorage
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
      console.log('Incoming message:', event.data);
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
    if (!createRoomName.trim()) {
      alert('Room name cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
      if (!token) {
        console.error('Access token is missing. Cannot create a room.');
        return;
      }

      const response = await fetch('https://testcore-qmyu.onrender.com/api/v1/chat/createChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomName: createRoomName,
          userId: localStorage.getItem('userId'),
        }),
      });
console.log("The Auth token is ", token)
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error creating room:', errorText);
        alert('Failed to create room. Please try again.');
        return;
      }

      const data = await response.json();
      if (data.statusCode === 200 && data.success) {
        const { roomName, AdminId } = data.data;
        setRoomName(roomName);
        setGroups((prev) => [...prev, roomName]);
        setCreateRoomName('');
        console.log(`Room "${roomName}" created successfully by Admin ${AdminId}!`);

        joinRoom(roomName);
      } else {
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
        roomName: room,
        userId,
      };
      socket.send(JSON.stringify(joinMessage));
      setRoomName(room);
    } else {
      console.error('WebSocket not connected. Cannot join room.');
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Access token is missing.');
        return;
      }

      const response = await fetch(`https://testcore-qmyu.onrender.com/api/v1/chat/ChatQuery/${room}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, roomName: room }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error joining room:', errorText);
        setJoinStatus('Error joining room');
        return;
      }

      const data = await response.json();
      if (data.statusCode === 200 && data.success) {
        setJoinStatus('Successfully joined the room');
        console.log(`Joined Room: ${room}`);
      } else {
        setJoinStatus('Failed to join room');
        alert('Failed to join room. Please try again.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('An error occurred while joining the room.');
    }
  };

  // Auto-scroll to the latest message
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to send messages through WebSocket
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

  // Send the message to the WebSocket server
  socket.send(JSON.stringify(message));

  // Add the message to the local chat state
  setMessages((prev) => [...prev, message]);
  setCurrentMessage('');
};


  return (
     <div id="container">
      {/* Sidebar Section */}
      <aside>
        <header>
          <h2>Chat Application</h2>
        </header>
        <input
          type="text"
          placeholder="Search rooms..."
          value={joinRoomName}
          onChange={(e) => setJoinRoomName(e.target.value)}
        />
        <ul>
          <li>
            <div className="group-list">
              <button onClick={() => joinRoom(joinRoomName)}>Join Room</button>
              {joinStatus && <div>{joinStatus}</div>}
            </div>
          </li>
          <li>
            <div>
             
              <input
                type="text"
                placeholder="Create Room"
                value={createRoomName}
                onChange={(e) => setCreateRoomName(e.target.value)}
              />
              <button onClick={createRoom}>Create Room</button>
            </div>
          </li>
          {groups.map((group) => (
            <li key={group}>
              <div onClick={() => setRoomName(group)}>
                <span className="status green"></span>
                <h2>{group}</h2>
              </div>
            </li>
          ))}
        </ul>
        <h3>Friends</h3>
        <ul>
          {friends.map((friend) => (
            <li key={friend}>
              <div>
                <span className="status blue"></span>
                <h2>{friend}</h2>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Section */}
      <main>
        <header>
          <div>
            <h2>Chat Room: {roomName}</h2>
            <h3>Connected as User {userId}</h3>
          </div>
        </header>
        <ul id="chat">
          {messages.map((message) => (
            <li key={message.MessageID} className={message.userId === userId ? "me" : "you"}>
              <div className="entete">
                <h2>{message.userId === userId ? "You" : message.username}</h2>
              </div>
              <div className="message">{message.content}</div>
              <span className="triangle"></span>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
        <footer>
          <textarea
            placeholder="Type your message here..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </footer>
      </main>
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

