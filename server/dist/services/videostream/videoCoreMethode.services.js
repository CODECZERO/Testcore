import axios from "axios";
import mediasoup from "mediasoup";
import { UniError } from "../../util/UniErrorHandler.js";
// ============= OPTIMIZED MEDIA CODECS =============
const mediaCodecs = [
    {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
        // Optimize for low latency
        parameters: {
            'minptime': 10,
            'useinbandfec': 1
        }
    },
    {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        // Optimize for faster encoding and lower latency
        parameters: {
            'x-google-start-bitrate': 500, // Lower start bitrate for faster connection
            'x-google-min-bitrate': 200,
            'x-google-max-bitrate': 2000,
            'x-google-bias-per-pixel': 0.0
        }
    },
    {
        kind: 'video',
        mimeType: 'video/VP9',
        clockRate: 90000,
        parameters: {
            'profile-id': 2,
            'x-google-start-bitrate': 500,
            'x-google-min-bitrate': 200,
            'x-google-max-bitrate': 2000
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
            'x-google-start-bitrate': 500,
            'x-google-min-bitrate': 200,
            'x-google-max-bitrate': 2000
        }
    }
];
// Cache for public IP
let cachedPublicIp = null;
// ============= CREATE WORKER =============
const createWorkerForService = async () => {
    try {
        const worker = await mediasoup.createWorker({
            logLevel: 'warn',
            rtcMinPort: 10000,
            rtcMaxPort: 15000,
            // Optimize worker settings for better performance
            appData: {
                version: '1.0.0',
                optimized: true
            }
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
};
// ============= CREATE ROUTER =============
const createRouterForService = async (worker) => {
    try {
        if (!worker) {
            throw new UniError("Worker not provided");
        }
        const router = await worker.createRouter({
            mediaCodecs,
            // Optimize router settings
            appData: {
                version: '1.0.0',
                optimized: true
            }
        });
        console.log(`✅ Router created [id:${router.id}]`);
        return router;
    }
    catch (error) {
        throw new UniError(`Failed to create router: ${error}`);
    }
};
// ============= CREATE TRANSPORT =============
const createTransportForService = async (router) => {
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
                const response = await axios.get('https://api.ipify.org?format=json', {
                    timeout: 3000 // Reduced timeout for faster failure
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
        // Optimized transport configuration for better performance
        const transport = await router.createWebRtcTransport({
            listenIps: [
                {
                    ip: '0.0.0.0',
                    announcedIp: publicIp
                }
            ],
            enableTcp: true,
            enableUdp: true,
            preferUdp: true, // UDP is faster for real-time communication
            // Optimize for low latency
            initialAvailableOutgoingBitrate: 1000000, // 1 Mbps initial bitrate
            minimumAvailableOutgoingBitrate: 300000, // 300 kbps minimum
            maxSctpMessageSize: 262144, // 256 KB max message size
            // Optimize ICE settings
            iceConsentTimeout: 10, // 10 seconds ICE consent timeout
            iceGatheringTimeout: 5, // 5 seconds ICE gathering timeout
            // App data for debugging
            appData: {
                version: '1.0.0',
                optimized: true,
                createdAt: Date.now()
            }
        });
        // Handle transport events with better error handling
        transport.on('dtlsstatechange', (dtlsState) => {
            console.log(`🔐 [${transport.id}] DTLS state: ${dtlsState}`);
            if (dtlsState === 'closed') {
                transport.close();
            }
        });
        transport.on('routerclose', () => {
            console.log(`🔌 [${transport.id}] Router closed, closing transport`);
            transport.close();
        });
        // Add ICE connection state monitoring
        transport.on('iceconnectionstatechange', (iceConnectionState) => {
            console.log(`🧊 [${transport.id}] ICE connection state: ${iceConnectionState}`);
        });
        transport.on('icegatheringstatechange', (iceGatheringState) => {
            console.log(`🧊 [${transport.id}] ICE gathering state: ${iceGatheringState}`);
        });
        console.log(`✅ Transport created [id:${transport.id}] with IP: ${publicIp}`);
        return transport;
    }
    catch (error) {
        throw new UniError(`Failed to create transport: ${error}`);
    }
};
export { createWorkerForService, createRouterForService, createTransportForService, mediaCodecs };
