import react, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

//ws stand for websocket

const chatRooms = useSelector((state: RootState) => state.Chat.chatRoomsState);
const [message, SetMessage] = useState('');
const [ws, setWs] = useState(null); // State to store the WebSocket instance


useEffect(() => {
    const ws = new WebSocket("wss://testcore-qmyu.onrender.com/ws1/");
    setWs(ws);

    ws.onopen = () => {

        chatRooms.map((room) => {
            ws.send(JSON.stringify(room.chatData?.roomName));
        })

        // chatRooms?.chatRoomsState[0]?.roomName.map((roomName) => {
        //     ws.curretnt.send(JSON.stringfiy({

        //     }));
        // });
    }
}, []);


const socketConnect = async (Message: Object) => {
    try {





        ws.onmessage(event) => {
    SetMessage(JSON.parse(event.data));
}
        
    }
    catch (error) {
    throw new Error("unable to connect to chatroom please check if it exitst");
}
}

const SocketLogic: React.FC = (roomName: string) => {
    const HandleForm = () => {

    }

    return (<>
    </>)
}

export default SocketLogic;