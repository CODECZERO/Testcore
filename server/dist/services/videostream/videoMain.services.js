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
let router;
let producerTransport;
let consumerTransport;
let producer;
let consumer;
let connectTransport;
const port = process.env.WEBSOCKETPORTVIDEO ? Number(process.env.WEBSOCKETPORTVIDEO) : 3000; //running websocket on same webserver but different port,
const wss = new WebSocketServer({ port });
const runVideoServer = () => __awaiter(void 0, void 0, void 0, function* () {
    router = yield videoMethode.startConnection(router);
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
                        producerTransport = yield videoMethode.createTransportForService(router, true, producerTransport);
                        const transportParams = {
                            id: producerTransport.id,
                            iceParameters: producerTransport.iceParameters,
                            iceCandidates: producerTransport.iceCandidates,
                            dtlsParameters: producerTransport.dtlsParameters,
                        };
                        ws.send(JSON.stringify(transportParams));
                        break;
                    case "connectTransport":
                        connectTransport = yield videoMethode.connectTransport(false, messageData.dtlsParameters, producerTransport);
                        ws.send("connected");
                        break;
                    case "consume":
                        break;
                    case "produce":
                        producer = yield videoMethode.producer(producerTransport, messageData.kind, messageData.rtpParameters);
                        console.log(producer);
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
export { runVideoServer };
