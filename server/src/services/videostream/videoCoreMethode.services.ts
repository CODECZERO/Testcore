import axios from "axios";
import mediasoup from "mediasoup";
import { Router, WebRtcTransport, Worker, RtpCodecCapability } from "mediasoup/node/lib/types";
import { UniError } from "../../util/UniErrorHandler.js";

// ============= MEDIA CODECS =============
const mediaCodecs: RtpCodecCapability[] = [
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
let cachedPublicIp: string | null = null;

// ============= CREATE WORKER =============
const createWorkerForService = async (): Promise<Worker> => {
    try {
        const worker = await mediasoup.createWorker({
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
    } catch (error) {
        throw new UniError(`Failed to create worker: ${error}`);
    }
};

// ============= CREATE ROUTER =============
const createRouterForService = async (worker: Worker): Promise<Router> => {
    try {
        if (!worker) {
            throw new UniError("Worker not provided");
        }

        const router = await worker.createRouter({ mediaCodecs });

        console.log(`✅ Router created [id:${router.id}]`);
        return router;
    } catch (error) {
        throw new UniError(`Failed to create router: ${error}`);
    }
};

// ============= CREATE TRANSPORT =============
const createTransportForService = async (router: Router): Promise<WebRtcTransport> => {
    try {
        if (!router) {
            throw new UniError("Router not provided");
        }

        // Get public IP (with caching)
        let publicIp: string;
        
        if (cachedPublicIp) {
            publicIp = cachedPublicIp;
        } else {
            try {
                const response = await axios.get('https://api.ipify.org?format=json', {
                    timeout: 5000
                });
                publicIp = response.data.ip;
                cachedPublicIp = publicIp;
                console.log(`📡 Public IP detected: ${publicIp}`);
            } catch (error) {
                console.warn('⚠️  Failed to get public IP, using localhost');
                publicIp = '127.0.0.1';
                cachedPublicIp = publicIp;
            }
        }

        const transport = await router.createWebRtcTransport({
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
    } catch (error) {
        throw new UniError(`Failed to create transport: ${error}`);
    }
};

export {
    createWorkerForService,
    createRouterForService,
    createTransportForService,
    mediaCodecs
};