import { parse } from "url";
import { ParsedUrlQuery } from "querystring";
import { Request } from "express";
import { ConsumeMessage } from "amqplib";
import { MessageData, CustomWebSocket, clients, rooms } from './chatServer.service.js';
import { ApiError } from "../../util/apiError.js";
import rabbitmq from "../rabbitmq/rabbitmq.services.js";
import { ChatTokenDec } from "./chatToken.services.js";
import { clinet } from "../twilio/twilioClinet.service.js";



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

const sendMessageToReciver = async (message: ConsumeMessage, userId: string, ws: CustomWebSocket): Promise<void> => {
    try {
        const messageContent = message.content.toString();
        const parsedMessage = JSON.parse(messageContent);

        for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN && ws.roomName === parsedMessage.roomName && userId !== parsedMessage?.userId) {
                console.log(userId +"\n"+ parsedMessage?.userId);
                client.send(messageContent);
            }
        }
    } catch (error) {
        console.error("Error while sending message to receiver:", error);
        throw new ApiError(500, "Error while receiving message");
    }
};

const reciveMEssage = async (roomName: string, userId: string, ws: CustomWebSocket) => {//recive message function
    try {
        await rabbitmq.subData(roomName);//subscribe to the queue, the queue name is same as roomName 
        await rabbitmq.channel.consume(rabbitmq.queue.queue, (message: ConsumeMessage | null) => {//consume the message from queue and uses a call back where it the message exitst
            //send it to user 
            if (message) sendMessageToReciver(message, userId, ws).catch(console.error);


        })
    } catch (error) {
        throw new ApiError(500, "error while reciveing message");//throw error if any thing went wrong, so later the dev can debug it 
    }
}


const closeSocket = async (MessageData: MessageData, ws: CustomWebSocket): Promise<void> => {
    try {
        const room = rooms[MessageData.roomName];
        if (room) {
            room.delete(ws);
            if (room.size === 0) {
                delete rooms[MessageData.roomName];
            }
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