import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addChatData } from './store/chatData.Store';
import { RootState } from '../store';

const BackendUrl = "https://testcore-qmyu.onrender.com";
const authToken = localStorage.getItem('accessToken');

const Groups: React.FC = () => {
  const dis = useDispatch();
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

  return (
    <div className="chat-rooms">
      <h2>Chat Rooms</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : chatRooms && chatRooms.length > 0 ? (
        chatRooms.map((room: any) => (
          <div key={room._id}>
            <h3>{room.chatData.map((data: any) => data.roomName).join(' / ')}</h3>
            <p>ID: {room._id}</p>
            <ul>
              {room.chatData.map((chat: any) => (
                <li key={chat._id}>{chat.roomName}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No chat rooms available.</p>
      )}
    </div>
  );
};

export default Groups;


