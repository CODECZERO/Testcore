import React, { useEffect, useState } from 'react';
import "./styles2/group.css"
import { useDispatch, useSelector } from 'react-redux';
import { addChatData } from './store/chatData.Store';
import { RootState } from '../store';
import { useRoom } from './RoomContext';
import Loader from '../Loader';
import apiClient, { getErrorMessage } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';

const Groups: React.FC = () => {
  const dis = useDispatch();
  const { setRoomName } = useRoom();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getChatData = async () => {
      try {
        const chatData = await apiClient.get(API_ENDPOINTS.CHAT.GET_CHATS);
        if (chatData?.data?.data) {
          dis(addChatData(chatData.data.data));
        } else {
          throw new Error("No chat data found");
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    getChatData();
  }, [dis]);

  const chatRooms = useSelector((state: RootState) => state.Chat.chatRoomsState);

  const handleJoinRoom = (roomName: string) => {
    setRoomName(roomName);
    console.log(`Joined room: ${roomName}`);
  };

  return (
    <div className="chat-rooms">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : chatRooms && chatRooms.length > 0 ? (
        chatRooms.map((room: any) => {
          const roomNames = room.chatData.map((data: any) => data.roomName);

          return (
            <div key={room._id}>
              {roomNames.map((roomName: string) => (
                <div
                  className="group-item"
                  key={roomName}
                  onClick={() => handleJoinRoom(roomName)}
                >

                  {/* Group Avatar */}
                  <div className="group-avatar">
                    {roomName.charAt(0).toUpperCase()}
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
