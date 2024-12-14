var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parse } from "url";
import { rooms } from './chatServer.service.js';
import { ApiError } from "../../util/apiError.js";
import rabbitmq from "../rabbitmq/rabbitmq.services.js";
import { ChatTokenDec } from "./chatToken.services.js";
const sendMessage = (MessageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageInfo = JSON.stringify(MessageData); //converts message pattern to string or json to string
        // const messageEnc=await SendMessageEncryption();//it a enctyption function, which encrypts message bfore sending,it to queue
        //so only the user/group/group member person can only open/read that message
        rabbitmq.publishData(messageInfo, MessageData.roomName); //publishing or send data to rabbitmq queue, so it can make record of message for 7 day
        //or for user defin time and it's a way of scaling the whole chat feature/application, insted of rabbitmq you can use kafka as it will be fast and quit robust
    }
    catch (error) {
        throw new ApiError(500, "error while sending message"); //throw error if any thing went wrong, so later the dev can debug it 
    }
});
const sendMessageToReciver = (message, rooms, ws) => __awaiter(void 0, void 0, void 0, function* () {
    //message to other and help theme recive that message also
    try {
        const messageContent = message.content.toString();
        const parsedMessage = JSON.parse(messageContent);
        const room = rooms[parsedMessage === null || parsedMessage === void 0 ? void 0 : parsedMessage.roomName];
        for (const client of room) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageContent);
            }
        }
    }
    catch (error) {
        console.error("Error while sending message to receiver:", error);
        throw new ApiError(500, "Error while receiving message");
    }
});
const reciveMEssage = (roomName, rooms, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rabbitmq.subData(roomName); //subscribe to the queue, the queue name is same as roomName 
        yield rabbitmq.channel.consume(rabbitmq.queue.queue, (message) => {
            //send it to user 
            if (message)
                sendMessageToReciver(message, rooms, ws).catch(console.error);
        });
    }
    catch (error) {
        throw new ApiError(500, "error while reciveing message"); //throw error if any thing went wrong, so later the dev can debug it 
    }
});
const closeSocket = (MessageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        rooms[MessageData.roomName].delete(ws); //checks the roomName in the collection of the rooms and removes the websocket connection from that room
        //rooms is a object which has information about how many users are connected to server as any user close's or end the connection with server
        //it will remove user from object 
        if (rooms[MessageData.roomName].size === 0) { //if there is no one in the current websocket server of that room or user of a room are not connected to the
            //websocket, it will delete the room from the rooms(object of room);.
            delete rooms[MessageData.roomName];
        }
    }
    catch (error) {
        console.error("Error while closing socket:", error);
        throw new ApiError(500, "Error while closing socket");
    }
});
const closeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rabbitmq.closeConnection();
    }
    catch (error) {
        throw new ApiError(500, "error while closeing connection"); //throw error if any thing went wrong, so later the dev can debug it 
    }
});
const tokenExtractr = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedUrl = parse(req.url || " ", true); //it parse query as string
        const queryParams = parsedUrl.query; //takes query from parsedUrl and  
        const tokenFromUser = queryParams === null || queryParams === void 0 ? void 0 : queryParams.token;
        if (!tokenFromUser)
            throw new ApiError(400, "bad request data is not provided");
        const chatToken = yield ChatTokenDec(tokenFromUser);
        if (chatToken instanceof ApiError)
            throw new ApiError(500, "something went wrong while decodeing token");
        return chatToken;
    }
    catch (error) {
        throw new ApiError(500, `Someting went wrong while extracing token error: ${error}`);
    }
});
export { sendMessage, reciveMEssage, closeSocket, closeConnection, tokenExtractr, };
