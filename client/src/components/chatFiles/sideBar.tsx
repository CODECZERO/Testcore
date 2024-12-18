import react, { useState } from 'react';
import CreateChat from "./createChat.tsx";
import JoinChat from "./joinChat.tsx";
import Groups from "./group.tsx";
import "../chatFiles/styles2/sidebar.css";

const SideBar: React.FC = () => {
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
            <div className="sidebar-header">
                Chat Sidebar
            </div>
            <div className="sidebar-section">
                <h3>Create Chat</h3>
                <CreateChat />
            </div>
            <div className="sidebar-section">
                <h3>Join Chat</h3>
                <JoinChat onRoomJoin={handleRoomJoin} />
            </div>
            <div className="sidebar-section">
                <h3>Groups</h3>
                <div className="groups-list-container">
                    <Groups />
                </div>
            </div>
        </div>
    </>
    );
}

export default SideBar;