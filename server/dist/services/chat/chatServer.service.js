var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebSocketServer } from "ws";
import { sendMessage, reciveMEssage, closeSocket } from "./chatMethodes.services.js";
import AsyncHandler from "../../util/ayscHandler.js";
export const rooms = {}; //a collection of rooms, to ensure/check how many user with same rooms are connected to websocket
const port = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 9017; //running websocket on same webserver but different port,
//i won't recommend that , as websocket it should be run on different server
//and it's better for scablity of the application 
const wss = new WebSocketServer({ port }); //creating websocket server on the port 9001 or 3000 or any other port diffene by the user
const clients = new Set(); //collection of websocket
const actions = {
    //actions are way of simply access or using the function based on the message type,
    //if message type is LEAVE_ROOM, the room the closeSocket function will be call
    //if message type is SEND_MESSAGE, the sendMessage fucntion will be call 
    // the both functin will be call in O(1) time.
    'SEND_MESSAGE': sendMessage,
    'LEAVE_ROOM': closeSocket,
    'DELETE_MESSAGE': sendMessage,
    'MODIFI_MESSAGE': sendMessage,
};
const runWebSocket = AsyncHandler(() => __awaiter(void 0, void 0, void 0, function* () {
    wss.on('connection', (ws, req) => {
        // const token = tokenExtractr(req);//this function extract the token from req objcet in starting and verify's it
        // if(!token){//for some reason , i am feeling that it can lead to vulnerability
        //   ws.close(4000,"Invalid request,User not have access to this group");
        //   return;
        // }
        ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            const MessageData = JSON.parse(message); //take data or message in message pattern from user first time as they join
            //beter use onconnection  or connection      
            if (!(MessageData && MessageData.MessageId && MessageData.roomName && MessageData.content && MessageData.typeOfMessage && MessageData.userId && MessageData.roomName)) { //check if the whole messagedata is provided or not 
                ws.close(4000, "Message data is not provided"); //if not close the websocket connection
                return;
            }
            if (!rooms[MessageData.roomName]) {
                rooms[MessageData.roomName] = new Set();
            }
            rooms[MessageData.roomName].add(ws);
            ws.roomName = MessageData.roomName;
            //if the room is not in rooms collection then add theme to roomCollection 
            //but , know i think, this conditon is stoping multiple people to connect to same room,check and find it out
            clients.add(ws); //adding websocket to the collection of websocket
            const typeAction = MessageData.typeOfMessage; //check the message data type
            if (!(typeAction === 'SEND_MESSAGE' || typeAction === 'LEAVE_ROOM')) { //if the message type is not in the typeOfMessage then close the websocket and return message
                ws.close(4000, "message type wasn't define");
                return;
            }
            const actiondata = actions[typeAction](MessageData, ws); //if the messagedat type exists then use the function, pass these function parameters
            //message data and webscoket connection
            if (!actiondata) { //if the message type is not in the typeOfMessage then close the websocket and return message
                ws.close(4000, "message type wasn't define");
                return;
            }
            yield reciveMEssage(MessageData.roomName, ws); //call the function and wait, if user send message the send to the websocket or wait for the message to come or send
        }));
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
}));
const closeChatSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        wss.close();
    }
    catch (error) {
        return error;
    }
});
export { runWebSocket, clients, closeChatSocket }; //exoprt the function so you can start the server at the beging
