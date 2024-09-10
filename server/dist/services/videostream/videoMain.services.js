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
import { consumerTransport, init, producerTransport, createConsumer } from "./videoMethode.services.js";
const port = process.env.WEBSOCKETPORTVIDEO ? Number(process.env.WEBSOCKETPORTVIDEO) : 3000; //running websocket on same webserver but different port,
const wss = new WebSocketServer({ port });
const runVideoServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield init();
    wss.on('connection', (ws) => {
        console.log('Client connected');
        // Step 1: Handle signaling messages
        ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            const { action, data } = JSON.parse(message);
            switch (action) {
                case 'createProducerTransport':
                    // Client requests producer transport creation
                    const producerTransportParams = {
                        id: producerTransport.id,
                        iceParameters: producerTransport.iceParameters,
                        iceCandidates: producerTransport.iceCandidates,
                        dtlsParameters: producerTransport.dtlsParameters
                    };
                    ws.send(JSON.stringify({ action: 'producerTransportCreated', data: producerTransportParams }));
                    break;
                case 'createConsumerTransport':
                    // Client requests consumer transport creation
                    const consumerTransportParams = {
                        id: consumerTransport.id,
                        iceParameters: consumerTransport.iceParameters,
                        iceCandidates: consumerTransport.iceCandidates,
                        dtlsParameters: consumerTransport.dtlsParameters
                    };
                    ws.send(JSON.stringify({ action: 'consumerTransportCreated', data: consumerTransportParams }));
                    break;
                case 'connectProducerTransport':
                    // Connect producer transport to the DTLS parameters sent by the client
                    yield producerTransport.connect({ dtlsParameters: data.dtlsParameters });
                    ws.send(JSON.stringify({ action: 'producerTransportConnected' }));
                    break;
                case 'connectConsumerTransport':
                    // Connect consumer transport to the DTLS parameters sent by the client
                    yield consumerTransport.connect({ dtlsParameters: data.dtlsParameters });
                    ws.send(JSON.stringify({ action: 'consumerTransportConnected' }));
                    break;
                case 'produce':
                    // Client sends RTP parameters to create a producer
                    const producer = yield producerTransport.produce({ kind: data.kind, rtpParameters: data.rtpParameters });
                    ws.send(JSON.stringify({ action: 'producerCreated', producerId: producer.id }));
                    break;
                case 'consume':
                    // Client requests to consume a producer's stream
                    const consumer = yield createConsumer(consumerTransport, data.producerId, data.rtpCapabilities);
                    ws.send(JSON.stringify({
                        action: 'consumerCreated',
                        id: consumer.id,
                        producerId: data.producerId,
                        kind: consumer.kind,
                        rtpParameters: consumer.rtpParameters
                    }));
                    break;
                case 'iceCandidate':
                    // Handle incoming ICE candidate from the client
                    const { candidate } = data;
                    if (candidate) {
                        yield producerTransport.addIceCandidate(candidate);
                    }
                    break;
                case 'closeTransport':
                    // Clean up when the client disconnects or closes a transport
                    producerTransport.close();
                    consumerTransport.close();
                    break;
                default:
                    console.log(`Unknown action: ${action}`);
            }
        }));
        // Handle WebSocket connection close
        ws.on('close', () => {
            console.log('Client disconnected');
            producerTransport.close();
            consumerTransport.close();
        });
    });
});
export { runVideoServer };
