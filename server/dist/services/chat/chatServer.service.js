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
import { ApiError } from "../../util/apiError.js";
import rabbitMqFunction from "../rabbitmq/rabbitmq.services.js";
const rooms = {};
const port = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 3000;
const wss = new WebSocketServer({ port });
const rabbitmq = new rabbitMqFunction;
const sendMessage = (MessageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageInfo = JSON.stringify(MessageData);
        // const messageEnc=await SendMessageEncryption();
        rabbitmq.publishData(MessageData.roomName, messageInfo);
    }
    catch (error) {
        throw new ApiError(500, "error while sending message");
    }
});
const reciveMEssage = (roomName, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageEnc = yield rabbitmq.subData(roomName);
        rabbitmq.channel.consume(rabbitmq.queue.queue, (message) => {
            if (message) {
                ws.send(message.toString());
            }
        });
    }
    catch (error) {
        throw new ApiError(500, "error while reciveing message");
    }
});
const closeSocket = (MessageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        rooms[MessageData.roomName].delete(ws);
        if (rooms[MessageData.roomName].size === 0) {
            delete rooms[MessageData.roomName];
        }
    }
    catch (error) {
        throw new ApiError(500, "error while closeing socket");
    }
});
const actions = {
    'SEND_MESSAGE': sendMessage,
    'LEAVE_ROOM': closeSocket,
};
const runWebSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        wss.on('connection', (ws) => {
            ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
                const MessageData = JSON.parse(message);
                console.log(MessageData);
                ws.send(JSON.stringify(MessageData));
                if (!MessageData) {
                    ws.close(4000, "Message data is not provided");
                    return;
                }
                if (!MessageData.roomName) {
                    ws.close(4000, "Message data is not provided");
                    return;
                }
                if (!rooms[MessageData.roomName])
                    ws.roomName = MessageData.roomName;
                const typeAction = MessageData.typeOfMessage;
                const actiondata = actions[typeAction](MessageData, ws);
                if (!actiondata) {
                    ws.close(4000, "message type wasn't define");
                    return;
                }
                yield reciveMEssage(MessageData.roomName, ws);
            }));
        });
    }
    catch (error) {
        throw new ApiError(500, "Error while runing websocket");
    }
});
export default runWebSocket;
