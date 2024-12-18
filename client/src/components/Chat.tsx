import React, { useState, useEffect } from "react";
import { useWebSocket } from "./chatFiles/ChatWrapper";
import CreateChat from "./chatFiles/createChat.tsx";
import JoinChat from "./chatFiles/joinChat.tsx";
import Groups from "./chatFiles/group.tsx";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { RootState } from "./store.tsx";

const generateMessageId = () => nanoid();

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>(() => {
    const savedMessages = sessionStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState(
    localStorage.getItem("roomName") || ""
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { socket } = useWebSocket();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const tabId = window.name; // Get the current tab's ID
  const userId = localStorage.getItem(`userId_${tabId}`) || "";

  // Update roomName dynamically when a new room is joined
  const handleRoomJoin = (newRoomName: string) => {
    setRoomName(newRoomName);
    console.log("Joined new room:", newRoomName);
  };

  // Handle Notification Permission Request
  const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          setNotificationsEnabled(true);
        } else {
          console.warn("Notification permission denied.");
        }
      } catch (err) {
        console.error("Error requesting notification permission:", err);
      }
    } else if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
    } else {
      console.warn("Notifications are denied.");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          if (messageData.userId && messageData.content) {
            const formattedMessage =
              messageData.userId === userId
                ? `You: ${messageData.content}`
                : `${userInfo?.name}: ${messageData.content}`;
            setMessages((prev) => [...prev, formattedMessage]);

            // Show a notification if enabled
            if (Notification.permission === "granted") {
              new Notification("New Message", {
                body: messageData.content,
              });
            }
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };
    }
  }, [socket, userId, userInfo]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const message = {
      MessageId: generateMessageId(),
      roomName: roomName,
      content: input,
      typeOfMessage: "SEND_MESSAGE",
      userId: userId,
    };

    if (socket && input.trim()) {
      socket.send(JSON.stringify(message));
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <>
      <CreateChat />
      <JoinChat onRoomJoin={handleRoomJoin} />
      <Groups />
      <div>
        <button onClick={requestNotificationPermission}>
          Enable Notifications
        </button>
        {notificationsEnabled && <p>Notifications are enabled!</p>}
        <div>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
};

export default Chat;
