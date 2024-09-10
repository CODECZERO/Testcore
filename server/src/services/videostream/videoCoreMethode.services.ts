import axios from "axios";
import mediasoup from "mediasoup";
import AsyncHandler from "../../util/ayscHandler.js";
import {Router, WebRtcTransport, Worker } from "mediasoup/node/lib/types";
import { UniError } from "../../util/UniErrorHandler.js";





//declaring media codecs
const mediaCodecs = [
    {
        kind: "audio",
        minetype: "audio/opus",
        clockRate: 48000,
        channels: 2,

    },
    {
        kind: "video",
        minetype: "video/VP8",
        clockRate: 90000,
        parameters: {
            "x-google-start-bitrate": 1000,
        }
    }
]

const createWorker = AsyncHandler(async (): Promise<Worker> => {
    const worker = await mediasoup.createWorker({
        rtcMinPort: 10000,
        rtcMaxPort: 15000,
    })

    worker.on('died', () => {
        throw new UniError("worker dided , restarting the service");
    })
    return worker;
});

const createRouter = async (worker: Worker): Promise<Router> => {
    if (!worker) throw new UniError("worker not provide");
    return await worker.createRouter({ mediaCodecs });
}

const createTransport =async (router:Router):Promise<WebRtcTransport> => {
    const publicIp = await axios.get('https://api.ipify.org?format=json').then((res) => res.data.ip);
    return await router.createWebRtcTransport({
        listenIps:[{ip:"0.0.0.0",announcedIp:publicIp}],
        enableTcp:true,
        enableUdp:true,
        preferUdp:true
    });
}




export {
    createRouter,
    createWorker,
    createTransport,
    
}