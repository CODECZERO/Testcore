var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { rooms } from './chatServer.service.js';
import { ApiError } from "../../util/apiError.js";
import rabbitmq from "../rabbitmq/rabbitmq.services.js";
const sendMessage = (messageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageInfo = JSON.stringify(messageData);
        yield rabbitmq.publishData(messageInfo, messageData.roomName);
    }
    catch (error) {
        console.error("Error while sending message:", error);
        throw new ApiError(500, "Error while sending message");
    }
});
const broadcastMessage = (message, roomName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageContent = message.content.toString();
        const parsedMessage = JSON.parse(messageContent);
        if (rooms[roomName]) {
            for (const client of rooms[roomName]) {
                if (client.readyState === WebSocket.OPEN && client.userId !== parsedMessage.userId) {
                    client.send(messageContent);
                }
            }
        }
    }
    catch (error) {
        console.error("Error while broadcasting message:", error);
        throw new ApiError(500, "Error while broadcasting message");
    }
});
const receiveMessage = (ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!ws.roomName) {
            throw new ApiError(400, "Room name not set for WebSocket");
        }
        yield rabbitmq.subData(ws.roomName);
        yield rabbitmq.channel.consume(rabbitmq.queue.queue, (message) => {
            if (message) {
                broadcastMessage(message, ws.roomName).catch(console.error);
                rabbitmq.channel.ack(message);
            }
        });
    }
    catch (error) {
        console.error("Error while receiving message:", error);
        throw new ApiError(500, "Error while receiving message");
    }
});
const closeSocket = (messageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (messageData.roomName && rooms[messageData.roomName]) {
            rooms[messageData.roomName].delete(ws);
            if (rooms[messageData.roomName].size === 0) {
                delete rooms[messageData.roomName];
            }
        }
        ws.close();
    }
    catch (error) {
        console.error("Error while closing socket:", error);
        throw new ApiError(500, "Error while closing socket");
    }
});
export { sendMessage, receiveMessage, closeSocket, };
