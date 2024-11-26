import SideBar from "./SideBar";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API calls, if using REST


// Interface for message structure
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const userId = "user123"; // Replace with dynamic user ID if needed.

  // Function to fetch messages from the backend


  const fetchMessages = async () => {
    try {
      const response = await axios.get<Message[]>('https://testcore-qmyu.onrender.com/ws1'); // Adjust endpoint
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Function to send a message to the backend
  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = {
          sender: userId,
          content: input,
          timestamp: new Date(),
        };

      try {
        const response = await axios.post<Message>('/api/messages', newMessage); // Adjust endpoint
        setMessages((prev) => [...prev, response.data]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
       
          <>
        <SideBar />
    <div className="chat-container">
 
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender === userId ? 'message-user' : 'message-bot'
            }`}
          >
            <p className="message-content">{msg.content}</p>
            <small className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      {/* Input Section */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>



  </>
  )
};

export default Chat;
