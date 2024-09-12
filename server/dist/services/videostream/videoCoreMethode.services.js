var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import mediasoup from "mediasoup";
import { UniError } from "../../util/UniErrorHandler.js";
//declaring media codecs
const rtpCapabilities = [
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
        parameters: {
            'x-google-start-bitrate': 1000
        }
    }
];
const createWorkerForService = () => __awaiter(void 0, void 0, void 0, function* () {
    const worker = yield mediasoup.createWorker({
        rtcMinPort: 10000,
        rtcMaxPort: 15000,
    });
    worker.on('died', () => {
        throw new UniError("worker dided , restarting the service");
    });
    return worker;
});
const createRouterForService = (worker) => __awaiter(void 0, void 0, void 0, function* () {
    if (!worker)
        throw new UniError("worker not provide");
    return yield worker.createRouter({ rtpCapabilities });
});
const createTransportForService = (router) => __awaiter(void 0, void 0, void 0, function* () {
    const publicIp = yield axios.get('https://api.ipify.org?format=json').then((res) => res.data.ip);
    return yield router.createWebRtcTransport({
        listenIps: [{ ip: "0.0.0.0", announcedIp: publicIp }],
        enableTcp: true,
        enableUdp: true,
        preferUdp: true
    });
});
export { createRouterForService, createWorkerForService, createTransportForService, };
