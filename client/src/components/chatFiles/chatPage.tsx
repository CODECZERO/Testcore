

import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./ChatWrapper.tsx";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { RootState } from "../store.tsx";
import { useRoom } from "./RoomContext"; // Import RoomContext
import "../chatFiles/styles2/chatPage.css";
import { BiLogoZoom, BiSolidSend, BiLinkAlt } from "react-icons/bi";

const generateMessageId = () => nanoid();

const ChatPage: React.FC = () => {
  const { roomName } = useRoom(); // Use the global roomName
  const [messages, setMessages] = useState<string[]>(() => {
    const savedMessages = sessionStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { socket } = useWebSocket();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const tabId = window.name; // Get the current tab's ID
  const userId = localStorage.getItem(`userId_${tabId}`) || "";

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference for the auto-scroll

  // Handle Notification Permission Request
  const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") setNotificationsEnabled(true);
    } else if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        if (messageData.userId && messageData.content) {
          const formattedMessage =
            messageData.userId === userId
              ? `You: ${messageData.content}`
              : `${userInfo?.name || "User"}: ${messageData.content}`;
          setMessages((prev) => [...prev, formattedMessage]);

          if (Notification.permission === "granted") {
            new Notification("New Message", { body: messageData.content });
          }
        }
      };
    }
  }, [socket, userId, userInfo]);

  // Auto-scroll logic
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger auto-scroll when messages update

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName) {
      alert("Please join a room first.");
      return;
    }

    const message = {
      MessageId: generateMessageId(),
      roomName,
      content: input,
      typeOfMessage: "SEND_MESSAGE",
      userId,
    };

    if (socket && input.trim()) {
      socket.send(JSON.stringify(message));
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
      {roomName}
        <BiLogoZoom className="icons" />
      </div>
      <div className="messages">
        <button className="enable-notifications-btn" onClick={requestNotificationPermission}>
          Enable Notifications
        </button>
        {notificationsEnabled && <p className="notifications-status">Notifications are enabled!</p>}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.startsWith("You:") ? "sent" : "received"}`}>
            <div className="text">{msg}</div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Auto-scroll target */}
      </div>

      <div className="input-container">
        <input
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <BiLinkAlt className="iconsss" />
        <button className="send-btn" onClick={sendMessage}>
          <BiSolidSend className="iconss" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;

