// import React, { useState, useEffect } from "react";
// import {  useWebSocket } from "./chatFiles/ChatWrapper";
// import CreateChat from "./chatFiles/createChat.tsx";
// import JoinChat from "./chatFiles/joinChat.tsx";
// import Groups from "./chatFiles/group.tsx";
// import { nanoid } from 'nanoid';
// import { useSelector } from "react-redux";
// import { RootState } from "./store.tsx";


// const generateMessageId = () => nanoid();

// const tabId = window.name; // Get the current tab's ID
// const userId = localStorage.getItem(`userId_${tabId}`) || '';



// const Chat: React.FC = () => {
//     const [messages, setMessages] = useState<string[]>([]);
//     const [input, setInput] = useState("");
//     const { socket } = useWebSocket();
//     const [roomName, setRoomName] = useState(localStorage.getItem("roomName") || "");
//     const userInfo = useSelector((state: RootState) => state.user.userInfo);

// useEffect(() => {
//   if (socket) {
//     console.log("Socket object:", socket);
//     console.log("Socket ready state:", socket.readyState);
//     socket.onmessage = (event) => {
//       console.log("Message received:", event.data);
//       try {
//         const messageData = JSON.parse(event.data);
//         console.log("Parsed message data:", messageData);
//         if (messageData.userId && messageData.content) {
//           const formattedMessage = messageData.userId === userId
//             ? `You: ${messageData.content}`
//             : `${userInfo?.name}: ${messageData.content}`;
//           setMessages((prev) => [...prev, formattedMessage]);
//           console.log("Updated messages state:", messages);
//         } else {
//           console.warn("Unexpected message structure:", messageData);
//         }
//       } catch (error) {
//         console.error("Error parsing message:", error);
//       }
//     };
//   }
// }, [socket]);

// console.log("Room Nmae: ",roomName);
   
//     const sendMessage = (e: React.FormEvent) => {
//         e.preventDefault();
//         const message = {
//             MessageId: generateMessageId(), // Example message ID, you can dynamically generate it if needed
//             roomName:roomName,
//             content: input,
//             typeOfMessage: "SEND_MESSAGE",
//             userId: userId, // Dynamically pass userId from localStorage
//           };
         
//         console.log(socket);
//         if (socket && input.trim()) {
//             console.log("entered")
//             socket.send(JSON.stringify(message));
//             setMessages((prev) => [...prev, `You: ${input}`]);
//             setInput("");
//         }
//     };

//     return (

//         <>
//             <CreateChat />
//             <JoinChat />
//             <Groups />
//             <div>
//                 <div>
//                     {messages.map((msg, index) => (
//                         <div key={index}>{msg}</div>
//                     ))}
//                 </div>
//                 <input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type a message"
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </>

//     );
// };

// export default Chat;


import React, { useState, useEffect } from "react";
import { useWebSocket } from "./chatFiles/ChatWrapper";
import CreateChat from "./chatFiles/createChat.tsx";
import JoinChat from "./chatFiles/joinChat.tsx";
import Groups from "./chatFiles/group.tsx";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { RootState } from "./store.tsx";

const generateMessageId = () => nanoid();
 // Get the current tab's ID
const userId = localStorage.getItem("userId") || '';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [roomName, setRoomName] = useState(localStorage.getItem("roomName") || "");
    const { socket } = useWebSocket();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    
  // Update roomName dynamically when a new room is joined
  const handleRoomJoin = (newRoomName: string) => {
    setRoomName(newRoomName);
    console.log("Joined new room:", newRoomName);
  };

  console.log("User ID : ",userId)
  console.log("Room :",roomName)    

 
useEffect(() => {
  if (socket) {
    console.log("Socket object:", socket);
    console.log("Socket ready state:", socket.readyState);
    socket.onmessage = (event) => {
      console.log("Message received:", event.data);
      try {
        const messageData = JSON.parse(event.data);
        console.log("Parsed message data:", messageData);
        if (messageData.userId && messageData.content) {
          const formattedMessage = messageData.userId === userId
            ? `You: ${messageData.content}`
            : `${userInfo?.name}: ${messageData.content}`;
          setMessages((prev) => [...prev, formattedMessage]);
          console.log("Updated messages state:", messages);
        } else {
          console.warn("Unexpected message structure:", messageData);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
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
      <JoinChat onRoomJoin={handleRoomJoin} />
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
