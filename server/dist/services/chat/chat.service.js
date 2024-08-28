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
const rooms = {};
const port = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 3000;
const wss = new WebSocketServer({ port });
let ws;
let parameters;
let roomName;
let a = 0;
const sendMessage = (MessageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageInfo = JSON.stringify(MessageData);
    }
    catch (error) {
        throw new ApiError(500, "error while sending message");
    }
});
const closeSocket = (ws, roomName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        rooms[roomName].delete(ws);
        if (rooms[roomName].size === 0) {
            delete rooms[roomName];
        }
    }
    catch (error) {
        throw new ApiError(500, "error while closeing socket");
    }
});
const actions = {
    'SEND_MESSAGE': () => { },
    'LEAVE_ROOM': () => { },
};
const runWebSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        wss.on('connection', (ws) => {
            ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
                const MessageData = JSON.parse(message);
                if (!MessageData) {
                    ws.close(4000, "Message data is not provided");
                    return;
                }
                ws.roomName = MessageData.roomName;
                if (!roomName) {
                    ws.close(4000, "Message data is not provided");
                    return;
                }
                const typeAction = MessageData.typeOfMessage;
                const actiondata = actions[typeAction];
                if (!actiondata) {
                    ws.close(4000, "message type wasn't define");
                    return;
                }
            }));
        });
        sub.on();
    }
    catch (error) {
        throw new ApiError(500, "Error while runing websocket");
    }
});
export default runWebSocket;
