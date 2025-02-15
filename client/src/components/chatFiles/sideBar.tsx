import  { useState } from 'react';
import CreateChat from "./createChat.tsx";
import JoinChat from "./joinChat.tsx";
import Groups from "./group.tsx";
import "../chatFiles/styles2/sidebaR.css";

interface SidebarProps {
    isCreateChatVisible: boolean;
    toggleCreateChat: () => void;
}


const SidebaR: React.FC<SidebarProps> = ({ isCreateChatVisible }) => {
    const [roomName, setRoomName] = useState(
        localStorage.getItem("roomName") || ""
      );


       // Update roomName dynamically when a new room is joined
  const handleRoomJoin = (newRoomName: string) => {
    setRoomName(newRoomName);
    console.log("Joined new room:", newRoomName);
  };


 
    
    return (
    <>
     <div className="sidebar">
          

            {isCreateChatVisible && (
                <div className="sidebar-section">
                    <CreateChat />
                </div>
            )}

            <div className="sidebar-section">
                <h3>Groups</h3>
                <div className="groups-list-container">
                    <Groups />
          
            <div className="sidebar-section">
                <JoinChat onRoomJoin={handleRoomJoin} />
            </div>
                </div>
            </div>

        </div>
    </>
    );
}

export default SidebaR;