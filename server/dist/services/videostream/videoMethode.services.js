var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import mediasoup from 'mediasoup';
const mediaSoupWorkers = [];
let mediaSoupRouter;
let producerTransport;
let consumerTransport;
const createWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    const worker = yield mediasoup.createWorker();
    mediaSoupWorkers.push(worker);
    return worker;
});
const createRouter = (worker) => __awaiter(void 0, void 0, void 0, function* () {
    const router = yield worker.createRouter({
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
            }
        ]
    });
    mediaSoupRouter = router;
});
const createTransport = (router) => __awaiter(void 0, void 0, void 0, function* () {
    const publicIp = yield axios.get("https://api.ipify.org?format=json").then((res) => res.data.ip);
    const transport = yield router.createWebRtcTransport({
        listenIps: [{ ip: "0.0.0.0", announcedIp: publicIp }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
    });
    return transport;
});
const createProducer = (transport, rtpParameters) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transport.producer({ kind: 'video', rtpParameters });
});
const createConsumer = (transport, producerId, rtpCapabilities) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mediaSoupRouter.canConsume({ producerId, rtpCapabilities })) {
        throw new Error('Cannot consume this producer');
    }
    const consumer = yield transport.consume({ producerId, rtpCapabilities, paused: true });
    return consumer;
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const worker = yield createWorker();
    yield createRouter(worker);
    producerTransport = yield createTransport(mediaSoupRouter);
    consumerTransport = yield createTransport(mediaSoupRouter);
    console.log("Video server working");
});
export { init, producerTransport, consumerTransport, mediaSoupRouter, createConsumer, createProducer };
