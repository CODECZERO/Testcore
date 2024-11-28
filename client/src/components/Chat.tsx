import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chat.css'
import SideBar from './SideBar';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isGroupMessage: boolean; // Indicates if it's a one-to-many message
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isGroupChat, setIsGroupChat] = useState<boolean>(false); // Toggle between one-to-one and one-to-many
  const userId = 'user123'; // Replace with actual user ID
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socket.current = new WebSocket('https://testcore-qmyu.onrender.com/ws1'); // Replace with your WebSocket server URL

    socket.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      setMessages((prev) => [...prev, data]);
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket.current) {
      const newMessage = {
        id: Date.now().toString(),
        sender: userId,
        content: input,
        timestamp: new Date(),
        isGroupMessage: isGroupChat,
      };

      // Send message through WebSocket
      socket.current.send(JSON.stringify(newMessage));

      // Optimistically update the message list
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
    }
  };
  
  return (
    <>
    <SideBar />
    <div className="chat-container">
      {/* Chat header with toggle for one-to-one or one-to-many */}
      <div className="chat-header">
        <h2>{isGroupChat ? 'Group Chat' : 'Private Chat'}</h2>
        <button onClick={() => setIsGroupChat(!isGroupChat)}>
          Switch to {isGroupChat ? 'Private Chat' : 'Group Chat'}
        </button>
      </div>

      {/* Render messages */}
      <div className="messages">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === userId ? 'message-user' : 'message-bot'}`}
            >
              <p className="message-content">{msg.content}</p>
              <small className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        ) : (
          <p>No messages yet. Start the conversation!</p>
        )}
      </div>

      {/* Input area */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div></>
  );
};

export default Chat;
