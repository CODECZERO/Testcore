import ChatPage from "./chatPage";
import SideBar from "../../components/DashBoard/SideBar";
import SidebaR  from "./sideBar"
import { useState } from "react";


const Chat: React.FC = () => {
 
  const [isCreateChatVisible, setIsCreateChatVisible] = useState(false);

  const toggleCreateChat = () => {
      setIsCreateChatVisible(!isCreateChatVisible);
  };

  return (
    <>
     <div style={{ display: "flex", height: "100vh", backgroundColor: "catedblue" }}>
    <SideBar toggleCreateChat={toggleCreateChat} />
    <br />
    <SidebaR isCreateChatVisible={isCreateChatVisible} toggleCreateChat={toggleCreateChat} />
    <ChatPage/>
    </div>
    </>
  );
};

export default Chat;
