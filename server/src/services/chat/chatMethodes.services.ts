import { parse } from "url";
import { ParsedUrlQuery } from "querystring";
import { Request } from "express";
import { ConsumeMessage } from "amqplib";
import { MessageData, CustomWebSocket, clients, Room, rooms } from './chatServer.service.js';
import { ApiError } from "../../util/apiError.js";
import rabbitmq from "../rabbitmq/rabbitmq.services.js";
import { ChatTokenDec } from "./chatToken.services.js";



const sendMessage = async (MessageData: MessageData, ws: CustomWebSocket,) => {//message send function
    try {
        const messageInfo = JSON.stringify(MessageData);//converts message pattern to string or json to string
        // const messageEnc=await SendMessageEncryption();//it a enctyption function, which encrypts message bfore sending,it to queue
        //so only the user/group/group member person can only open/read that message
        rabbitmq.publishData(messageInfo, MessageData.roomName);//publishing or send data to rabbitmq queue, so it can make record of message for 7 day
        //or for user defin time and it's a way of scaling the whole chat feature/application, insted of rabbitmq you can use kafka as it will be fast and quit robust

    } catch (error) {
        throw new ApiError(500, "error while sending message");//throw error if any thing went wrong, so later the dev can debug it 
    }
}

const sendMessageToReciver = async (message: ConsumeMessage, rooms: Room, ws: CustomWebSocket): Promise<void> => {//this function take's message from user and send
    //message to other and help theme recive that message also
    try {
        const messageContent = message.content.toString();
        const parsedMessage = JSON.parse(messageContent);

        const room = rooms[parsedMessage?.roomName];

        for (const client of room) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageContent);
            }
        }
    } catch (error) {
        console.error("Error while sending message to receiver:", error);
        throw new ApiError(500, "Error while receiving message");
    }
};

const reciveMEssage = async (roomName: string, rooms: Room, ws: CustomWebSocket) => {//recive message function
    try {
        await rabbitmq.subData(roomName);//subscribe to the queue, the queue name is same as roomName 
        await rabbitmq.channel.consume(rabbitmq.queue.queue, (message: ConsumeMessage | null) => {//consume the message from queue and uses a call back where it the message exitst
            //send it to user 
            if (message) sendMessageToReciver(message, rooms, ws).catch(console.error);


        })
    } catch (error) {
        throw new ApiError(500, "error while reciveing message");//throw error if any thing went wrong, so later the dev can debug it 
    }
}


const closeSocket = async (MessageData: MessageData, ws: CustomWebSocket): Promise<void> => {
    try {
        rooms[MessageData.roomName].delete(ws);//checks the roomName in the collection of the rooms and removes the websocket connection from that room
        //rooms is a object which has information about how many users are connected to server as any user close's or end the connection with server
        //it will remove user from object 
        if (rooms[MessageData.roomName].size === 0) {//if there is no one in the current websocket server of that room or user of a room are not connected to the
            //websocket, it will delete the room from the rooms(object of room);.
            delete rooms[MessageData.roomName];
        }
    } catch (error) {
        console.error("Error while closing socket:", error);
        throw new ApiError(500, "Error while closing socket");
    }
};

const closeConnection = async () => {
    try {
        await rabbitmq.closeConnection();
    } catch (error) {
        throw new ApiError(500, "error while closeing connection")//throw error if any thing went wrong, so later the dev can debug it 

    }
}

const tokenExtractr = async (req: Request) => {//takes requset object from websocket extract token from it.
    try {
        const parsedUrl = parse(req.url || " ", true);//it parse query as string
        const queryParams: ParsedUrlQuery = parsedUrl.query;//takes query from parsedUrl and  
        const tokenFromUser: string = queryParams?.token as string;
        if (!tokenFromUser) throw new ApiError(400, "bad request data is not provided");
        const chatToken = await ChatTokenDec(tokenFromUser);
        if (chatToken instanceof ApiError) throw new ApiError(500, "something went wrong while decodeing token");
        return chatToken;
    } catch (error) {
        throw new ApiError(500, `Someting went wrong while extracing token error: ${error}`)
    }
}


export {
    sendMessage,
    reciveMEssage,
    closeSocket,
    closeConnection,
    tokenExtractr,
}