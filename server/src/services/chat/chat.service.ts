import { WebSocketServer, WebSocket } from "ws";
import { ApiError } from "../../util/apiError.js";

const rooms: any = {};
const port: number = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 3000;
const wss = new WebSocketServer({ port });
let ws: WebSocket;
let parameters;
let roomName: string;
let a = 0;

const joinRoom = async (ws: WebSocket, roomName: string) => {
  try {
    if (!rooms[roomName]) {
      rooms[roomName] = new Set();
    }
    rooms[roomName].add(ws);
  } catch (error) {
    throw new ApiError(500, "error while find and storing room");
  }
}

const sendMessage = async (messageBuffer: Buffer, roomName: string, ws: WebSocket) => {
  try {
    rooms[roomName].forEach((client: WebSocket) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageBuffer));
      }
    });
  } catch (error) {
    throw new ApiError(500, "error while sending message");
  }
}

const closeSocket = async (ws: WebSocket, roomName: string) => {
  try {
    rooms[roomName].delete(ws);
    if (rooms[roomName].size === 0) {
      delete rooms[roomName];
    }
  } catch (error) {
    throw new ApiError(500, "error while closeing socket")
  }
}



const runWebSocket = async () => {

  try {
    wss.on('connection', (ws) => {
    console.log("on");
    ws.on('message', (messageData) => {
      const { roomName, message } = JSON.parse(messageData.toString());

      if (!roomName || !message) {
        throw new ApiError(400, "Invalid message format");
      }
      joinRoom(ws, roomName);
      console.log(roomName);
      sendMessage(message, roomName, ws);
    })
    ws.on('close', () => {
      if (rooms[roomName].has(ws)) {
        closeSocket(ws, roomName);
      }
    })
  })
} catch (error) {
  throw new ApiError(500, "Error while runing websocket");
}
}

export default runWebSocket;