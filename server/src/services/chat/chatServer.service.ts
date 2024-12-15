import { WebSocketServer, WebSocket } from "ws";
import { sendMessage, receiveMessage, closeSocket } from "./chatMethodes.services.js";
import AsyncHandler from "../../util/ayscHandler.js";
import { Request } from "express";
import { ChatTokenDec } from "./chatToken.services.js";

type typeOfMessage = "SEND_MESSAGE" | "LEAVE_ROOM" | "DELETE_MESSAGE" | "MODIFI_MESSAGE";

type MessageData = {
  MessageId: string,
  typeOfMessage: typeOfMessage,
  roomName: string,
  userId: string,
  content: string
}

interface CustomWebSocket extends WebSocket {
  roomName?: string;
  userId?: string;
}

const rooms: Record<string, Set<CustomWebSocket>> = {};
const port: number = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 3000;
const wss = new WebSocketServer({ port });
const clients = new Set<CustomWebSocket>();

const actions: Record<typeOfMessage, (data: MessageData, ws: CustomWebSocket) => Promise<void>> = {
  'SEND_MESSAGE': sendMessage,
  'LEAVE_ROOM': closeSocket,
  'DELETE_MESSAGE': sendMessage,
  'MODIFI_MESSAGE': sendMessage,
};

const runWebSocket = AsyncHandler(async () => {
  wss.on('connection', async (ws: CustomWebSocket, req: Request) => {
    try {
      // const token = await tokenExtractr(req);
      // if (!token) {
      //   ws.close(4000, "Invalid request, User does not have access to this group");
      //   return;
      // }



      ws.on('message', async (message: string) => {
        try {
          const MessageData: MessageData = JSON.parse(message);

          if (!(MessageData && MessageData.MessageId && MessageData.roomName && MessageData.content && MessageData.typeOfMessage && MessageData.userId)) {
            ws.close(4000, "Message data is not provided");
            return;
          }

          ws.userId = MessageData.userId;

          if (!rooms[MessageData.roomName]) {
            rooms[MessageData.roomName] = new Set();
          }
          rooms[MessageData.roomName].add(ws);
          ws.roomName = MessageData.roomName;

          clients.add(ws);

          const typeAction = MessageData.typeOfMessage;
          const action = actions[typeAction];
          if (!action) {
            ws.close(4000, "Invalid message type");
            return;
          }

          await action(MessageData, ws);
          
          await receiveMessage(ws);
        } catch (error) {
          console.error("Error processing message:", error);
          ws.close(4000, "Error processing message");
        }
      });

      ws.on('close', () => {
        clients.delete(ws);
        if (ws.roomName && rooms[ws.roomName]) {
          rooms[ws.roomName].delete(ws);
          if (rooms[ws.roomName].size === 0) {
            delete rooms[ws.roomName];
          }
        }
        console.log(`Client disconnected. Total clients: ${clients.size}`);
      });
    } catch (error) {
      console.error("Error establishing WebSocket connection:", error);
      ws.close(4000, "Error establishing connection");
    }
  });
});

const closeChatSocket = async () => {
  try {
    wss.close();
    console.log("WebSocket server closed");
  } catch (error) {
    console.error("Error closing WebSocket server:", error);
    return error;
  }
};

export {
  runWebSocket,
  MessageData,
  CustomWebSocket,
  clients,
  rooms,
  closeChatSocket
};

