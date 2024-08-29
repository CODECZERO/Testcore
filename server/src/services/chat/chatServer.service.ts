import { WebSocketServer, WebSocket } from "ws";
import { ApiError } from "../../util/apiError.js";
import rabbitmq from "../rabbitmq/rabbitmq.services.js";
import { ConsumeMessage } from "amqplib";
// import { SendMessageEncryption } from "../../controller/chat.controller.js";

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

type typeOfMessage = "SEND_MESSAGE" | "LEAVE_ROOM";

type MessageData = {
  MessageId: string,
  typeOfMessage: typeOfMessage,
  roomName: string,
  userId: string,
  content: string
}

interface CustomWebSocket extends WebSocket {
  roomName?: string;  // Optional property's
  sub?: string;
}

const rooms: any = {};
const port: number = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 3000;
const wss = new WebSocketServer({ port });



const sendMessage = async (MessageData: MessageData, ws: CustomWebSocket,) => {
  try {
    const messageInfo = JSON.stringify(MessageData);
    // const messageEnc=await SendMessageEncryption();
    rabbitmq.publishData(JSON.stringify(MessageData), MessageData.roomName);

  } catch (error) {
    throw new ApiError(500, "error while sending message");
  }
}

const reciveMEssage = async (roomName: string, ws: WebSocket) => {
  try {
    const messageEnc = await rabbitmq.subData(roomName);
    rabbitmq.channel.consume(rabbitmq.queue.queue, (message:ConsumeMessage|null) => {
      if (message) {
        ws.send(JSON.stringify(message.content));
      }
    })
  } catch (error) {
    throw new ApiError(500, "error while reciveing message");
  }
}

const closeSocket = async (MessageData: MessageData, ws: CustomWebSocket) => {
  try {
    rooms[MessageData.roomName].delete(ws);
    if (rooms[MessageData.roomName].size === 0) {
      delete rooms[MessageData.roomName];
    }
  } catch (error) {
    throw new ApiError(500, "error while closeing socket")
  }
}


const actions = {

  'SEND_MESSAGE': sendMessage,
  'LEAVE_ROOM': closeSocket,

}


const runWebSocket = async () => {

  try {
    wss.on('connection', (ws: CustomWebSocket) => {
      ws.on('message', async (message: string) => {
        const MessageData: MessageData = JSON.parse(message);        
        ws.send(JSON.stringify(MessageData));
        if (!MessageData) {
          ws.close(4000, "Message data is not provided");
          return;
        }

        if (!MessageData.roomName) {
          ws.close(4000, "Message data is not provided");
          return;
        }

        if (!rooms[MessageData.roomName]) ws.roomName = MessageData.roomName;


        const typeAction = MessageData.typeOfMessage;
        const actiondata = actions[typeAction](MessageData, ws);

        if (!actiondata) {
          ws.close(4000, "message type wasn't define");
          return;
        }


        await reciveMEssage(MessageData.roomName, ws);
      })
    });



  } catch (error) {
    throw new ApiError(500, "Error while runing websocket");
  }
}

export default runWebSocket;