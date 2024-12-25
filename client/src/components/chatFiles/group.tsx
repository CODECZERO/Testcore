// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { addChatData } from './store/chatData.Store';
// import { RootState } from '../store';

// const BackendUrl = "https://testcore-qmyu.onrender.com";
// const authToken = localStorage.getItem('accessToken');

// const Groups: React.FC = () => {
//   const dis = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getChatData = async () => {
//       try {
//         const chatData = await axios.get(`${BackendUrl}/api/v1/chat/getChat`, {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         });
//         if (chatData?.data?.data) {
//           dis(addChatData(chatData.data.data));
//         } else {
//           throw new Error("No chat data found");
//         }
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     getChatData();
//   }, [dis]);

//   const chatRooms = useSelector((state: RootState) => state.Chat.chatRoomsState);

//   return (
//     <div className="chat-rooms">
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p>Error: {error}</p>
//       ) : chatRooms && chatRooms.length > 0 ? (
//         chatRooms.map((room: any) => (
//           <div key={room._id}>
//             <h3>{room.chatData.map((data: any) => data.roomName).join(' / ')}</h3>
//           </div>
//         ))
//       ) : (
//         <p>No chat rooms available.</p>
//       )}
//     </div>
//   );
// };

// export default Groups;


import React, { useEffect, useState } from 'react';
import "./styles2/group.css"
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addChatData } from './store/chatData.Store';
import { RootState } from '../store';
import { useRoom } from './RoomContext'; // Import RoomContext to update the room name when joining
import Loader from '../Loader';

const BackendUrl = "https://testcore-qmyu.onrender.com";
const authToken = localStorage.getItem('accessToken');

const Groups: React.FC = () => {
  const dis = useDispatch();
  const { setRoomName } = useRoom(); // Get the function to update the room name in global context
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getChatData = async () => {
      try {
        const chatData = await axios.get(`${BackendUrl}/api/v1/chat/getChat`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (chatData?.data?.data) {
          dis(addChatData(chatData.data.data));
        } else {
          throw new Error("No chat data found");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getChatData();
  }, [dis]);

  const chatRooms = useSelector((state: RootState) => state.Chat.chatRoomsState);

  const handleJoinRoom = (roomName: string) => {
    // Set the room name globally and join the room automatically
    setRoomName(roomName);
    console.log(`Joined room: ${roomName}`);
  };

  return (
    <div className="chat-rooms">
      {isLoading ? (
      <Loader/>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : chatRooms && chatRooms.length > 0 ? (
        chatRooms.map((room: any) => {
          // Extract and display only the first room name
          const roomNames = room.chatData.map((data: any) => data.roomName);
         
          return (
            <div key={room._id}>
              {roomNames.map((roomName: string) => (
                <div
                  className="group-item"
                  key={roomName}
                  onClick={() => handleJoinRoom(roomName)} // Join individual room
                >
                  console.log{roomName};
                  {/* Group Avatar */}
                  <div className="group-avatar">
                    {roomName.charAt(0).toUpperCase()} {/* First letter of the room name */}
                  </div>
                  {/* Group Name */}
                  <div className="group-name">{roomName}</div>
                </div>
              ))}
            </div>
          );
        })
      ) : (
        <p className="no-rooms">No chat rooms available.</p>
      )}
    </div>
  );
};

export default Groups;
