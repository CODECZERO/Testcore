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
import videoMethode from "./videoMethodes.services.js";
import { nanoid } from "nanoid";
import { getVideoServerTransport, removeVideoServerTranspor, setVideoServerTransport } from "../../db/database.redis.query.js";
let Transport = new Map();
let producerTransport;
let connectTransport;
const port = process.env.WEBSOCKETPORTVIDEO ? Number(process.env.WEBSOCKETPORTVIDEO) : 9022; //running websocket on same webserver but different port,
const wss = new WebSocketServer({ port });
const runVideoServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const router = yield videoMethode.startConnection();
    wss.on('connection', (ws, req) => {
        // const token = VideoTokenExtracter();
        // if (!token) {//for some reason , i am feeling that it can lead to vulnerability
        //     ws.close(4000, "Invalid request,User not have access to this group");
        //     return;
        // }
        ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const messageData = JSON.parse(message);
                switch (messageData.actionType) {
                    case 'getRouterRtpCapabilities':
                        yield videoMethode.getRouterRtpCapabilities(ws, router);
                        break;
                    case "createTransport":
                        const id = nanoid(12);
                        const TransportData = yield videoMethode.createTransportForService(router, true, producerTransport);
                        const transportParams = {
                            id: TransportData.id,
                            iceParameters: TransportData.iceParameters,
                            iceCandidates: TransportData.iceCandidates,
                            dtlsParameters: TransportData.dtlsParameters,
                        };
                        yield setVideoServerTransport(id, TransportData);
                        ws.send(JSON.stringify({ "Id": id, transportParams }));
                        break;
                    case "connectTransport":
                        const producerTransportxL = yield getVideoServerTransport(messageData.Id);
                        connectTransport = yield videoMethode.connectTransport(false, messageData.dtlsParameters, producerTransportxL);
                        ws.send("connected");
                        break;
                    case "consume":
                        const consumerTransportL = yield getVideoServerTransport(messageData.Id);
                        const consumer = yield videoMethode.consumer(consumerTransportL, router, messageData.producerId, messageData.rtpCapabilities);
                        ws.send(JSON.stringify(consumer));
                        break;
                    case "produce":
                        const producerTransportL = yield getVideoServerTransport(messageData.Id);
                        const producer = yield videoMethode.producer(producerTransportL, messageData.kind, messageData.rtpParameters);
                        ws.send(JSON.stringify(producer));
                        break;
                    case "remove":
                        yield removeVideoServerTranspor(messageData.Id);
                        ws.send("Removed");
                        break;
                    default:
                        ws.send("action/message action wasn't define");
                        ws.close(4004);
                        break;
                }
            }
            catch (error) {
                ws.close(5000, `Some error occure ${error}`);
            }
        }));
        ws.on('close', () => {
            ws.send("close");
            return;
        });
    });
});
const closeVideoServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        wss.close();
    }
    catch (error) {
        return error;
    }
});
export { runVideoServer, closeVideoServer };
