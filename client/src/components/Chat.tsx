import React, { useState, useEffect } from "react";
import {  useWebSocket } from "./chatFiles/ChatWrapper";
import CreateChat from "./chatFiles/createChat.tsx";
import JoinChat from "./chatFiles/joinChat.tsx";
import Groups from "./chatFiles/group.tsx";
import { nanoid } from 'nanoid';


const generateMessageId = () => nanoid();

const userId = localStorage.getItem('userId') || ' ';


const Chat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const { socket } = useWebSocket();
    const roomName = localStorage.getItem("roomName") || "cc/v"; 

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                setMessages((prev) => [...prev, event.data]);
            };
        }
    }, [socket]);
    
    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const message = {
            MessageId: generateMessageId(), // Example message ID, you can dynamically generate it if needed
            roomName:roomName,
            content: input,
            typeOfMessage: "SEND_MESSAGE",
            userId: userId, // Dynamically pass userId from localStorage
          };
         
        console.log(socket);
        if (socket && input.trim()) {
            console.log("entered")
            socket.send(JSON.stringify(message));
            setMessages((prev) => [...prev, `You: ${input}`]);
            setInput("");
        }
    };

    return (

        <>
            <CreateChat />
            <JoinChat />
            <Groups />
            <div>
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
