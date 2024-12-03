// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from './store'; // Adjust the path to your store file
// import "../styles/Chat.css";

// interface ChatMessage {
//   MessageID: string;
//   content: string;
//   typeOfMessage: 'SEND_MESSAGE' | 'LEAVE_ROOM';
//   userId: string;
//   username: string;
//   roomName: string;
// }

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [currentMessage, setCurrentMessage] = useState<string>('');
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [roomName, setRoomName] = useState<string>('default_room');
//   const [groups, setGroups] = useState<string[]>([]);
//   const [friends, setFriends] = useState<string[]>([]);

//   // Redux: Extract user information
//   const userInfo = useSelector((state: RootState) => state.user.userInfo);
//   const userId = localStorage.getItem('userId') || '';

//   // Initialize WebSocket connection
//   useEffect(() => {
//     if (!userId) return;

//     const token = localStorage.getItem('accesToken'); // Access token from localStorage
//     if (!token) {
//       console.error('Access token is missing. Cannot connect to WebSocket.');
//       return;
//     }

//     console.log('Connecting to WebSocket with token:', token);
//     const socketUrl = `wss://testcore-qmyu.onrender.com/ws1/?token=${token}`;
//     const ws = new WebSocket(socketUrl);

//     setSocket(ws);

//     ws.onopen = () => {
//       console.log('WebSocket connection established.');
//       setIsConnected(true);
//     };

//     ws.onmessage = (event) => {
//       const incomingMessage: ChatMessage = JSON.parse(event.data);
//       setMessages((prev) => [...prev, incomingMessage]);
//     };

//     ws.onclose = () => {
//       console.log('WebSocket connection closed.');
//       setIsConnected(false);
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     return () => {
//       ws.close();
//     };
//   }, [userId]);

//   // Load groups and friends
//   useEffect(() => {
//     const fetchGroupsAndFriends = async () => {
//       // Mock API calls to fetch groups and friends (replace with real API calls)
//       setGroups(['Group 1', 'Group 2', 'Group 3']);
//       setFriends(['Friend 1', 'Friend 2', 'Friend 3']);
//     };

//     fetchGroupsAndFriends();
//   }, []);

//   // Send message through WebSocket
//   const sendMessage = () => {
//     if (!socket || socket.readyState !== WebSocket.OPEN || !currentMessage.trim()) {
//       console.warn('Cannot send message: WebSocket not ready or message is empty.');
//       return;
//     }

//     const message: ChatMessage = {
//       MessageID: 'msg_' + new Date().getTime(),
//       content: currentMessage,
//       typeOfMessage: 'SEND_MESSAGE',
//       userId,
//       username: userInfo?.name || 'Unknown User',
//       roomName,
//     };

//     socket.send(JSON.stringify(message));
//     setMessages((prev) => [...prev, message]);
//     setCurrentMessage('');
//   };

//   // Auto-scroll to the latest message
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   const createRoom = async () => {
//     try {
//       const token = localStorage.getItem('accesToken'); // Retrieve the token from localStorage
//       if (!token) {
//         console.error('Access token is missing. Cannot create a room.');
//         return;
//       }
  
//       const roomName = `GR005/BE`; // Example room name, adjust dynamically as needed
  
//       const response = await fetch('https://testcore-qmyu.onrender.com/api/v1/chat/createChat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
//         },
//         body: JSON.stringify({
//           roomName,
//           userId: localStorage.getItem('userId'), // Replace with appropriate user ID
//         }),
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Error creating room:', errorText);
//         alert('Failed to create room. Please try again.');
//         return;
//       }
  
//       const data = await response.json();
//       console.log('Room creation response:', data);
  
//       // Properly handle the response
//       if (data.statusCode === 200 && data.success) {
//         const { romeName, AdminId } = data.data;
//         setRoomName(romeName); // Update the UI with the created room name
//         setGroups((prev) => [...prev, romeName]); // Add the new room to the groups list
//         console.log(`Room "${romeName}" created successfully by Admin ${AdminId}!`);
//       } else {
//         console.error('Unexpected response format:', data);
//         alert('Room creation failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error creating room:', error);
//       alert('An unexpected error occurred while creating the room.');
//     }
//   };
  

//   return (
//     <div className="chat-container">
//       {/* Left Section: Groups and Friends */}
//       <div className="chat-left">
//         <h3>Groups</h3>
//         <div className="group-list">
//           <button className="create-room-button" onClick={createRoom}>
//             Create Room
//           </button>
//           {groups.map((group) => (
//             <div
//               key={group}
//               className="group-item"
//               onClick={() => setRoomName(group)}
//             >
//               {group}
//             </div>
//           ))}
//         </div>

//         <h3>Friends</h3>
//         <div className="friend-list">
//           {friends.map((friend) => (
//             <div key={friend} className="friend-item">
//               {friend}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Section: Chat */}
//       <div className="chat-right">
//         <h2 className="chat-title">Chat Room: {roomName}</h2>

//         {/* Messages */}
//         <div className="messages-container">
//           {messages.map((message) => (
//             <div
//               key={message.MessageID}
//               className={`message ${message.userId === userId ? 'outgoing' : 'incoming'}`}
//             >
//               <strong>{message.userId === userId ? 'You' : message.username}</strong>
//               : {message.content}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Message Input */}
//         <div className="input-container">
//           <input
//             type="text"
//             value={currentMessage}
//             onChange={(e) => setCurrentMessage(e.target.value)}
//             placeholder="Type a message..."
//           />
//           <button onClick={sendMessage}>Send</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

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

  const createRoom = async () => {
    if (!newRoomName.trim()) {
      alert('Room name cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('accesToken'); // Retrieve the token from localStorage
        console.log("token :" ,token)
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
        const { romeName, AdminId } = data.data;
        setRoomName(romeName); // Update the UI with the created room name
        setGroups((prev) => [...prev, romeName]); // Add the new room to the groups list
        console.log(`Room "${romeName}" created successfully by Admin ${AdminId}!`);
        setNewRoomName(''); // Clear the input field after room creation
      } else {
        console.error('Unexpected response format:', data);
        alert('Room creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('An unexpected error occurred while creating the room.');
    }
  };

  return (
    <div className="chat-container">
      {/* Left Section: Groups and Friends */}
      <div className="chat-left">
        <h3>Groups</h3>
        <div className="group-list">
          <button className="create-room-button" onClick={createRoom}>
            Create Room
          </button>
          {/* Input to create a dynamic room name */}
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter room name"
          />
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
