// import React, { useState, useEffect, useRef } from 'react';
// import '../styles/Chat.css'
// import SideBar from './SideBar';

// interface Message {
//   id: string;
//   sender: string;
//   content: string;
//   timestamp: Date;
//   isGroupMessage: boolean; // Indicates if it's a one-to-many message
// }

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>('');
//   const [isGroupChat, setIsGroupChat] = useState<boolean>(false); // Toggle between one-to-one and one-to-many
//   const userId = 'user123'; // Replace with actual user ID
//   const socket = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     // Initialize WebSocket connection
//     socket.current = new WebSocket('https://testcore-qmyu.onrender.com/ws1'); // Replace with your WebSocket server URL

//     socket.current.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     socket.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log('Received message:', data);
//       setMessages((prev) => [...prev, data]);
//     };

//     socket.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     socket.current.onclose = () => {
//       console.log('WebSocket disconnected');
//     };

//     return () => {
//       socket.current?.close();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (input.trim() && socket.current) {
//       const newMessage = {
//         id: Date.now().toString(),
//         sender: userId,
//         content: input,
//         timestamp: new Date(),
//         isGroupMessage: isGroupChat,
//       };

//       // Send message through WebSocket
//       socket.current.send(JSON.stringify(newMessage));

//       // Optimistically update the message list
//       setMessages((prev) => [...prev, newMessage]);
//       setInput('');
//     }
//   };
  
//   return (
//     <>
//     <SideBar />
//     <div className="chat-container">
//       {/* Chat header with toggle for one-to-one or one-to-many */}
//       <div className="chat-header">
//         <h2>{isGroupChat ? 'Group Chat' : 'Private Chat'}</h2>
//         <button onClick={() => setIsGroupChat(!isGroupChat)}>
//           Switch to {isGroupChat ? 'Private Chat' : 'Group Chat'}
//         </button>
//       </div>

//       {/* Render messages */}
//       <div className="messages">
//         {messages.length > 0 ? (
//           messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`message ${msg.sender === userId ? 'message-user' : 'message-bot'}`}
//             >
//               <p className="message-content">{msg.content}</p>
//               <small className="message-timestamp">
//                 {new Date(msg.timestamp).toLocaleTimeString()}
//               </small>
//             </div>
//           ))
//         ) : (
//           <p>No messages yet. Start the conversation!</p>
//         )}
//       </div>

//       {/* Input area */}
//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..." />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div></>
//   );
// };

// export default Chat;

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  MessageID: string;
  content: string;
  typeOfMessage: 'SEND_MESSAGE' | 'LEAVE_ROOM';
  userId: string;
  roomName: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Reference for auto-scrolling messages
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Extract JWT and User ID from localStorage
  const token = localStorage.getItem('accesToken'); // Ensure this key matches the one used to store
  const userId = localStorage.getItem('userId'); // Ensure this key matches the one used to store

  // Check if JWT and UserID are present before trying to establish the WebSocket connection
  useEffect(() => {
    if (!token || !userId) {
      console.error('JWT token or User ID is missing. Redirecting to login...');
      return;
    }

    console.log('JWT Token:', token);
    console.log('User ID:', userId);

    
    if (token && userId) {
      const socketUrl = `wss://testcore-qmyu.onrender.com/ws1/`;

      // Create WebSocket connection
      const ws = new WebSocket(socketUrl);

      // Set the WebSocket instance to state
      setSocket(ws);

      // Handle incoming messages
      ws.onmessage = (event) => {
        const incomingMessage: ChatMessage = JSON.parse(event.data);

        // Handle different message types (if any)
        if (incomingMessage.typeOfMessage === 'LEAVE_ROOM') {
          alert(`${incomingMessage.userId} has left the room.`);
        } else if (incomingMessage.typeOfMessage === 'SEND_MESSAGE') {
          setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        }
      };

      // Handle WebSocket open event
      ws.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
      };

      // Handle WebSocket close event
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
      };

      // Handle WebSocket error event
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      // Clean up WebSocket connection on component unmount
      return () => {
        ws.close();
      };
    } else {
      console.error('JWT token or User ID not found in localStorage');
    }
  }, [token, userId]);

  // Send a message to the WebSocket server
  const sendMessage = () => {
    if (socket && currentMessage.trim()) {
      if (socket.readyState === WebSocket.OPEN) {
        const message: ChatMessage = {
          MessageID: '12345' + new Date().getTime(), // Generate unique MessageID
          content: "Hello everyone!!",
          typeOfMessage: 'SEND_MESSAGE',
          userId: "67890" , // Fallback if userId is not found
          roomName: 'GeneralChatRoom', // You can make this dynamic if needed
        };

        // Send message to the WebSocket server
        socket.send(JSON.stringify(message));

        // Update UI with the sent message
        setMessages((prevMessages) => [...prevMessages, message]);

        // Clear the input field after sending
        setCurrentMessage('');
      } else {
        console.warn('WebSocket is not open. Attempting to reconnect...');
        // Optionally implement reconnection logic here
      }
    }
  };

  // Auto-scroll the messages container when a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Chat Room</h2>

      {/* Display chat messages */}
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((message) => (
          <div key={message.MessageID} style={{ marginBottom: '10px' }}>
            <strong>{message.userId}</strong>: {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field to send new message */}
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button
          onClick={sendMessage}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
