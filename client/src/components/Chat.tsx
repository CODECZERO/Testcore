// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';

// import { RootState } from './store'; // Adjust the path to your store file
// import "../styles/Chat.css";
// import Groups from "./chatFiles/group"
// import CreateChat from './chatFiles/createChat';
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
//   const [createRoomName, setCreateRoomName] = useState<string>(''); // State for create room input
//   const [joinRoomName, setJoinRoomName] = useState<string>(''); // State for join room input
//   const [joinStatus, setJoinStatus] = useState<string>('');

//   // Redux: Extract user information
//   const userInfo = useSelector((state: RootState) => state.user.userInfo);
//   const userId = localStorage.getItem('userId') || '';
//   const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage

//   // const MessageData={
//   //   MessageId:"01",
//   //   roomName:`${}`,
//   //   content:`${'intia message'}`,
//   //   typeOfMessage:"SEND_MESSAGE",
//   //   userId:`${userId}`
//   // }


//   // // Initialize WebSocket connection

//   // Join Room functionality
//   const joinRoom = async (room: string) => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       const joinMessage = {
//         typeOfMessage: 'JOIN_ROOM',
//         roomName: room,
//         userId,
//       };
//       socket.send(JSON.stringify(joinMessage));
//       setRoomName(room);
//     } else {
//       console.error('WebSocket not connected. Cannot join room.');
//     }

//     try {
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         alert('Access token is missing.');
//         return;
//       }

//       const response = await fetch(`https://testcore-qmyu.onrender.com/api/v1/chat/ChatQuery/${room}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId, roomName: room }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Error joining room:', errorText);
//         setJoinStatus('Error joining room');
//         return;
//       }

//       const data = await response.json();
//       if (data.statusCode === 200 && data.success) {
//         setJoinStatus('Successfully joined the room');
//         console.log(`Joined Room: ${room}`);
//       } else {
//         setJoinStatus('Failed to join room');
//         alert('Failed to join room. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error joining room:', error);
//       alert('An error occurred while joining the room.');
//     }
//   };

//   // Auto-scroll to the latest message
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

// //   // Function to send messages through WebSocket
// // const sendMessage = () => {
// //   if (!socket || socket.readyState !== WebSocket.OPEN || !currentMessage.trim()) {
// //     console.warn('Cannot send message: WebSocket not ready or message is empty.');
// //     return;
// //   }

// //   const message: ChatMessage = {
// //     MessageID: 'msg_' + new Date().getTime(),
// //     content: currentMessage,
// //     typeOfMessage: 'SEND_MESSAGE',
// //     userId,
// //     username: userInfo?.name || 'Unknown User',
// //     roomName,
// //   };

// //   // Send the message to the WebSocket server
// //   socket.send(JSON.stringify(message));

// //   // Add the message to the local chat state
// //   setMessages((prev) => [...prev, message]);
// //   setCurrentMessage('');
// // };
// }

//   return (
//     <div className="chat-container">
//       {/* Left Section: Groups and Friends */}
//       <div className="chat-left">
//         <h3>Groups</h3>
//         <div className="group-list">
//           <div>
//             <h3>Join a Room</h3>
//             <input
//               type="text"
//               value={joinRoomName}
//               onChange={(e) => setJoinRoomName(e.target.value)}
//               placeholder="Enter room name to join"
//             />
//             <button onClick={() => joinRoom(joinRoomName)}>Join Room</button>
//             {joinStatus && <div>{joinStatus}</div>}
//           </div>


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
//         <ul>
//           {friends.map((friend) => (
//             <li key={friend}>
//               <div>
//                 <span className="status blue"></span>
//                 <h2>{friend}</h2>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Section */}
//       <main>
//         <header>
//           <div>
//             <h2>Chat Room: {roomName}</h2>
//             <h3>Connected as User {userId}</h3>
//           </div>
//         </header>
//         <ul id="chat">
//           {messages.map((message) => (
//             <li key={message.MessageID} className={message.userId === userId ? "me" : "you"}>
//               <div className="entete">
//                 <h2>{message.userId === userId ? "You" : message.username}</h2>
//               </div>
//               <div className="message">{message.content}</div>
//               <span className="triangle"></span>
//             </li>
//           ))}
//           <div ref={messagesEndRef} />
//         </ul>
//         <footer>
//           <textarea
//             placeholder="Type your message here..."
//             value={currentMessage}
//             onChange={(e) => setCurrentMessage(e.target.value)}
//           />
//           <button onClick={sendMessage}>Send</button>
//         </footer>
//       </main>

//       <CreateChat/>
//     </div>
//   );
// };

// export default Chat;


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




import React, { useContext, useState, useEffect } from "react";
import { WebSocketContext, useWebSocket } from "./chatFiles/ChatWrapper";
import { ChatWrapper } from "./chatFiles/ChatWrapper.tsx";
import CreateChat from "./chatFiles/createChat.tsx";
import JoinChat from "./chatFiles/joinChat.tsx";
import Groups from "./chatFiles/group.tsx";
const userId = localStorage.getItem('userId') || ' ';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const { socket } = useWebSocket();

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
            MessageId: "12345", // Example message ID, you can dynamically generate it if needed
            roomName: "CC/bsc",
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
