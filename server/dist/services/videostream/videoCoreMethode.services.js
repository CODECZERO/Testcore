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
// ============= MEDIA CODECS =============
const mediaCodecs = [
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
    },
    {
        kind: 'video',
        mimeType: 'video/VP9',
        clockRate: 90000,
        parameters: {
            'profile-id': 2,
            'x-google-start-bitrate': 1000
        }
    },
    {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
            'packetization-mode': 1,
            'profile-level-id': '42e01f',
            'level-asymmetry-allowed': 1,
            'x-google-start-bitrate': 1000
        }
    }
];
// Cache for public IP
let cachedPublicIp = null;
// ============= CREATE WORKER =============
const createWorkerForService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const worker = yield mediasoup.createWorker({
            logLevel: 'warn',
            rtcMinPort: 10000,
            rtcMaxPort: 15000,
        });
        worker.on('died', (error) => {
            console.error('❌ Mediasoup worker died!', error);
            // Restart worker after 2 seconds
            setTimeout(() => process.exit(1), 2000);
        });
        console.log(`✅ Worker created [pid:${worker.pid}]`);
        return worker;
    }
    catch (error) {
        throw new UniError(`Failed to create worker: ${error}`);
    }
});
// ============= CREATE ROUTER =============
const createRouterForService = (worker) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!worker) {
            throw new UniError("Worker not provided");
        }
        const router = yield worker.createRouter({ mediaCodecs });
        console.log(`✅ Router created [id:${router.id}]`);
        return router;
    }
    catch (error) {
        throw new UniError(`Failed to create router: ${error}`);
    }
});
// ============= CREATE TRANSPORT =============
const createTransportForService = (router) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!router) {
            throw new UniError("Router not provided");
        }
        // Get public IP (with caching)
        let publicIp;
        if (cachedPublicIp) {
            publicIp = cachedPublicIp;
        }
        else {
            try {
                const response = yield axios.get('https://api.ipify.org?format=json', {
                    timeout: 5000
                });
                publicIp = response.data.ip;
                cachedPublicIp = publicIp;
                console.log(`📡 Public IP detected: ${publicIp}`);
            }
            catch (error) {
                console.warn('⚠️  Failed to get public IP, using localhost');
                publicIp = '127.0.0.1';
                cachedPublicIp = publicIp;
            }
        }
        const transport = yield router.createWebRtcTransport({
            listenIps: [
                {
                    ip: '0.0.0.0',
                    announcedIp: publicIp
                }
            ],
            enableTcp: true,
            enableUdp: true,
            preferUdp: true
        });
        // Handle transport events
        transport.on('dtlsstatechange', (dtlsState) => {
            if (dtlsState === 'closed') {
                transport.close();
            }
        });
        transport.on('routerclose', () => {
            transport.close();
        });
        return transport;
    }
    catch (error) {
        throw new UniError(`Failed to create transport: ${error}`);
    }
});
export { createWorkerForService, createRouterForService, createTransportForService, mediaCodecs };
