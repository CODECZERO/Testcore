// import React, { useState, useEffect } from 'react';

// interface ConnectChatProps {
//   setIsConnected: (isConnected: boolean) => void;
//   roomName: string;
//   branch: string;
// }

// const ConnectChat: React.FC<ConnectChatProps> = ({ setIsConnected, roomName, branch }) => {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>('');

//   // Function to initiate the connection to the chat room
//   const connectToRoom = async () => {
//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const token = localStorage.getItem('accesToken');
//       if (!token) {
//         setErrorMessage('Access token is missing.');
//         setIsLoading(false);
//         return;
//       }

//       // Make the API request to get the connection token
//       const response = await fetch(`https://testcore-qmyu.onrender.com/api/v1/chat/connectChat/${roomName}/${branch}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         setErrorMessage(data.message || 'Failed to connect to the chat room.');
//         setIsLoading(false);
//         return;
//       }

//       // Save the token and set the connection status
//       const chatToken = data.token;
//       localStorage.setItem('chatToken', chatToken);  // Save the token for future requests

//       // On success, set connection status
//       setIsConnected(true);
//       setIsLoading(false);
//     } catch (error) {
//       setErrorMessage('An error occurred while connecting to the chat room.');
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Automatically attempt to connect when roomName and branch are provided
//     if (roomName && branch) {
//       connectToRoom();
//     }
//   }, [roomName, branch]);

//   return (
//     <div className="connect-chat-container">
//       {isLoading ? (
//         <p>Connecting to the chat room...</p>
//       ) : (
//         <>
//           <h2>Connecting to {roomName} - {branch}</h2>
//           <button onClick={connectToRoom}>Connect</button>
//           {errorMessage && <p className="error">{errorMessage}</p>}
//         </>
//       )}
//     </div>
//   );
// };

// export default ConnectChat;
