// import React, { createContext, useState, useEffect, ReactNode } from "react";

// const WebSocketContext = createContext<WebSocket | null>(null);

// interface ChatWrapperProps {
//     children: ReactNode;
// }

// const ChatWrapper: React.FC<ChatWrapperProps> = ({ children }) => {
//     const [socket, setSocket] = useState<WebSocket | null>(null);

//     useEffect(() => {
//         const ws = new WebSocket("wss://testcore-qmyu.onrender.com/api/v1/chat");
//         setSocket(ws);

//         ws.onopen = () => console.log("WebSocket connected");
//         ws.onclose = () => console.log("WebSocket disconnected");
//         ws.onerror = (error) => console.error("WebSocket error", error);

//         return () => ws.close();
//     }, []);

//     return (
//         <WebSocketContext.Provider value={socket}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// };

// export { ChatWrapper, WebSocketContext };



import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

interface WebSocketContextType {
    socket: WebSocket | null;
    sendMessage: (roomName: string, content: string) => void;
}
// WebSocket context to provide the WebSocket instance
const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface ChatWrapperProps {
    children: ReactNode;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("wss://testcore-qmyu.onrender.com/ws1/");

        setSocket(ws);

        ws.onopen = () => console.log("WebSocket connected");
        ws.onclose = () => console.log("WebSocket disconnected");
        ws.onerror = (error) => console.error("WebSocket error", error);

        return () => ws.close();
    }, []);

    const sendMessage = (roomName: string, content: string) => {
        if (!socket) {
            console.error("WebSocket is not connected.");
            return;
        }

        const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

        if (!userId) {
            console.error("User ID not found in localStorage.");
            return;
        }

        const message = {
            MessageId: "12345", // Example message ID, you can dynamically generate it if needed
            roomName: roomName,
            content: content,
            typeOfMessage: "SEND_MESSAGE",
            userId: userId, // Dynamically pass userId from localStorage
        };

        // Send the message in JSON format
        socket.send(JSON.stringify(message));
    };

    return (
        <WebSocketContext.Provider value={{ socket, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Custom hook to access WebSocket and sendMessage
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a ChatWrapper");
    }
    return context;
};

export { ChatWrapper, WebSocketContext };

