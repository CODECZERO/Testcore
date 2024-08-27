import { WebSocketServer, WebSocket } from "ws";
import { ApiError } from "../../util/apiError.js";


/*
  ***Message pattern***
      Message={
        "MessageID":"Message id genreated using nanoid",
        "content":"Here put user message",
        "typeOfMessage":"SEND_MESSAGE or LEAVE_ROOM",
        "userId":"Id of user",
        "roomName":"Name of the room which is get by using connectChat for the user"
      }
*/

type typeOfMessage="SEND_MESSAGE"|"LEAVE_ROOM";

type MessageData={
  MessageId:string,
  typeOfMessage:string,
  roomName:string,
  userId:string,
  content:string  
}

interface CustomWebSocket extends WebSocket {
  roomName?: string;  // Optional property's
  sub?: string;
}

const rooms: any = {};
const port: number = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 3000;
const wss = new WebSocketServer({ port });
let ws: WebSocket;
let parameters;
let roomName: string;
let a = 0;



const sendMessage = async (MessageData:MessageData, ws: CustomWebSocket) => {
  try {
      const messageInfo=JSON.stringify(MessageData);

  } catch (error) {
    throw new ApiError(500, "error while sending message");
  }
}



const closeSocket = async (ws: CustomWebSocket, roomName: string) => {
  try {
    rooms[roomName].delete(ws);
    if (rooms[roomName].size === 0) {
      delete rooms[roomName];
    }
  } catch (error) {
    throw new ApiError(500, "error while closeing socket")
  }
}


const actions={

  'SEND_MESSAGE':()=>{},
  'LEAVE_ROOM':()=>{},

}


const runWebSocket = async () => {

  try {
    wss.on('connection', (ws:CustomWebSocket) => {
      ws.on('message',async (message:string)=>{
          const MessageData:MessageData=JSON.parse(message);
          if(!MessageData){
            ws.close(4000,"Message data is not provided");
            return;
          }
          ws.roomName=MessageData.roomName;

          if(!roomName){
            ws.close(4000,"Message data is not provided");
            return;
          }

          const typeAction=MessageData.typeOfMessage;
          const actiondata=actions[typeAction];

          if(!actiondata){
            ws.close(4000,"message type wasn't define");
            return;
          }
      })
  });

  sub.on()

} catch (error) {
  throw new ApiError(500, "Error while runing websocket");
}
}

export default runWebSocket;