import { ConsumeMessage } from "amqplib";
import { MessageData, CustomWebSocket, rooms } from './chatServer.service.js';
import { ApiError } from "../../util/apiError.js";
import rabbitmq from "../rabbitmq/rabbitmq.services.js";

const sendMessage = async (messageData: MessageData, ws: CustomWebSocket): Promise<void> => {
    try {
        const messageInfo = JSON.stringify(messageData);
        await rabbitmq.publishData(messageInfo, messageData.roomName);
    } catch (error) {
        console.error("Error while sending message:", error);
        throw new ApiError(500, "Error while sending message");
    }
};

const broadcastMessage = async (message: ConsumeMessage, roomName: string): Promise<void> => {
    try {
        const messageContent = message.content.toString();
        const parsedMessage: MessageData = JSON.parse(messageContent);

        if (rooms[roomName]) {
            for (const client of rooms[roomName]) {
                if (client.readyState === WebSocket.OPEN && client.userId !== parsedMessage.userId) {
                    client.send(messageContent);
                }
            }
        }
    } catch (error) {
        console.error("Error while broadcasting message:", error);
        throw new ApiError(500, "Error while broadcasting message");
    }
};

const receiveMessage = async (ws: CustomWebSocket): Promise<void> => {
    try {
        if (!ws.roomName) {
            throw new ApiError(400, "Room name not set for WebSocket");
        }

        await rabbitmq.subData(ws.roomName);
        await rabbitmq.channel.consume(rabbitmq.queue.queue, (message: ConsumeMessage | null) => {
            if (message) {
                broadcastMessage(message, ws.roomName!).catch(console.error);
                rabbitmq.channel.ack(message);
            }
        });
    } catch (error) {
        console.error("Error while receiving message:", error);
        throw new ApiError(500, "Error while receiving message");
    }
};

const closeSocket = async (messageData: MessageData, ws: CustomWebSocket): Promise<void> => {
    try {
        if (messageData.roomName && rooms[messageData.roomName]) {
            rooms[messageData.roomName].delete(ws);
            if (rooms[messageData.roomName].size === 0) {
                delete rooms[messageData.roomName];
            }
        }
        ws.close();
    } catch (error) {
        console.error("Error while closing socket:", error);
        throw new ApiError(500, "Error while closing socket");
    }
};

export {
    sendMessage,
    receiveMessage,
    closeSocket,
};

