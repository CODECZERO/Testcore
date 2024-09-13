import { UniError } from "../../util/UniErrorHandler.js";
import { Router, WebRtcTransport, Worker } from "mediasoup/node/lib/types.js";
import { createTransportForService, createWorkerForService, createRouterForService } from "./videoCoreMethode.services.js";
import { WebSocket } from "ws";

class VideoMethode {
    private router: Router;
    private worker: Worker;

    constructor() {
        this.router = undefined as any;
        this.worker = undefined as any;
    }

    public getRouterRtpCapabilities = async (ws: WebSocket, router: Router) => {
        try {
            if (!router || !ws) throw new UniError("websocket or router is not provied")
            ws.send(JSON.stringify(router.rtpCapabilities));
        } catch (error) {
            throw new UniError(`error while geting routercapablilities ${error}`);
        }
    }

    public createTransportForService = async (router: Router, sender: boolean, producerTransport?: WebRtcTransport, consumerTransport?: WebRtcTransport) => {
        try {
            const transport = await createTransportForService(router);
            if (sender) {
                producerTransport = transport;

            }
            return consumerTransport = transport;
        } catch (error) {
            throw new UniError(`error while creatin tranport for service ${error}`);
        }
    }

    public connectTransport = async (sender: boolean, dtlsParameters?: any, producerTransport?: WebRtcTransport, consumerTransport?: WebRtcTransport) => {
        if (sender) {
            return await producerTransport?.connect({ dtlsParameters });
        }
        return await consumerTransport?.connect({ dtlsParameters });
    }

    public producer = async (producerTransport: WebRtcTransport, kind: any, rtpParameters: any) => {
        try {
            const f = producerTransport.produce({
                kind,
                rtpParameters
            });
            return f;
        } catch (error) {
            throw new UniError(`error in producer ${error}`)
        }
    }

    public consumer = async (consumerTransport: WebRtcTransport, router: Router, producerId: any, rtpCapabilities: any) => {
        try {
            if (!router.canConsume) throw new UniError("unable to consume data");
            router.canConsume({ producerId: producerId, rtpCapabilities });

            return await consumerTransport.consume({
                producerId,
                rtpCapabilities,
                paused: false
            });
        } catch (error) {
            throw new UniError(`error in consumer ${error}`);
        }
    }

    public startConnection = async () => {
        try {
            this.worker = await createWorkerForService();
            this.router = await createRouterForService(this.worker);
            return this.router;
        } catch (error) {
            throw new UniError(`error while connecting to server ${error}`);
        }
    }
}

const videoMethode = new VideoMethode();

export default videoMethode;