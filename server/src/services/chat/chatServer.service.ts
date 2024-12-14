import { WebSocketServer, WebSocket } from "ws";
import { sendMessage, reciveMEssage, closeSocket, tokenExtractr } from "./chatMethodes.services.js";
import AsyncHandler from "../../util/ayscHandler.js";
import { Request } from "express";


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

type typeOfMessage = "SEND_MESSAGE" | "LEAVE_ROOM";//types of message which a user can send

type MessageData = {//Message pattern
  MessageId: string,
  typeOfMessage: typeOfMessage,
  roomName: string,
  userId: string,
  content: string
}

interface CustomWebSocket extends WebSocket {//custom interface for websocket so i can put extra value there
  roomName?: string;  // Optional property's
  userId?: string;
}

export interface Room {
  [roomName: string]: Set<CustomWebSocket>;
}


export const rooms: Room = {};//a collection of rooms, to ensure/check how many user with same rooms are connected to websocket
const port: number = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 9017;//running websocket on same webserver but different port,
//i won't recommend that , as websocket it should be run on different server
//and it's better for scablity of the application 
const wss = new WebSocketServer({ port });//creating websocket server on the port 9001 or 3000 or any other port diffene by the user
const clients = new Set<WebSocket>();//collection of websocket




const actions = {
  //actions are way of simply access or using the function based on the message type,
  //if message type is LEAVE_ROOM, the room the closeSocket function will be call
  //if message type is SEND_MESSAGE, the sendMessage fucntion will be call 
  // the both functin will be call in O(1) time.
  'SEND_MESSAGE': sendMessage,
  'LEAVE_ROOM': closeSocket,
  'DELETE_MESSAGE': sendMessage,
  'MODIFI_MESSAGE': sendMessage,



}


const runWebSocket = AsyncHandler(async () => {//runWebSocket, it will create webscoket server and performe action, such as on message or other
  wss.on('connection', (ws: CustomWebSocket, req: Request) => {//if webserver is running
    // const token = tokenExtractr(req);//this function extract the token from req objcet in starting and verify's it

    // if(!token){//for some reason , i am feeling that it can lead to vulnerability
    //   ws.close(4000,"Invalid request,User not have access to this group");
    //   return;
    // }

    ws.on('message', async (message: string) => {//if websocket is running
      const MessageData: MessageData = JSON.parse(message);//take data or message in message pattern from user first time as they join
      //beter use onconnection  or connection      

      if (!(MessageData && MessageData.MessageId && MessageData.roomName && MessageData.content && MessageData.typeOfMessage && MessageData.userId && MessageData.roomName)) {//check if the whole messagedata is provided or not 
        ws.close(4000, "Message data is not provided");//if not close the websocket connection
        return;
      }

      if (!rooms[MessageData.roomName]) ws.roomName = MessageData.roomName;//if the room is not in rooms collection then add theme to roomCollection 
      //but , know i think, this conditon is stoping multiple people to connect to same room,check and find it out

      clients.add(ws);//adding websocket to the collection of websocket
      const typeAction = MessageData.typeOfMessage;//check the message data type
      if (!(typeAction === 'SEND_MESSAGE' || typeAction === 'LEAVE_ROOM')) {//if the message type is not in the typeOfMessage then close the websocket and return message
        ws.close(4000, "message type wasn't define");
        return;
      }

      const actiondata = actions[typeAction](MessageData,ws);//if the messagedat type exists then use the function, pass these function parameters
      //message data and webscoket connection

      if (!actiondata) {//if the message type is not in the typeOfMessage then close the websocket and return message
        ws.close(4000, "message type wasn't define");
        return;
      }
      await reciveMEssage(MessageData.roomName, rooms, ws);//call the function and wait, if user send message the send to the websocket or wait for the message to come or send
    })

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
  });
});

const closeChatSocket = async () => {//close websokcet for chat service
  try {
    wss.close();
  } catch (error) {
    return error;
  }
}

export {
  runWebSocket,
  MessageData,
  CustomWebSocket,
  clients,
  closeChatSocket
}//exoprt the function so you can start the server at the beging