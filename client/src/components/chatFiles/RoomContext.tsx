import React, { createContext, useContext, useState } from "react";

interface RoomContextType {
  roomName: string;
  setRoomName: (name: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomName, setRoomName] = useState<string>(
    localStorage.getItem("roomName") || ""
  );

  const updateRoomName = (name: string) => {
    setRoomName(name);
    localStorage.setItem("roomName", name);
  };

  return (
    <RoomContext.Provider value={{ roomName, setRoomName: updateRoomName }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
