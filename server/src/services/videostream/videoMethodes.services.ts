import { UniError } from "../../util/UniErrorHandler.js";
import { Router, WebRtcTransport } from "mediasoup/node/lib/types.js";
import { createTransport } from "./videoCoreMethode.services.js";


const getRouterRtpCapabilities = async (ws: WebSocket, router: Router) => {
    try {
        if (!router || !ws) throw new UniError("websocket or router is not provied")
        ws.send(JSON.stringify(router.rtpCapabilities));
    } catch (error) {
        throw new UniError(`error while geting routercapablilities ${error}`);
    }
}

const createTransportForService = async (router: Router, sender: boolean, producerTransport?: WebRtcTransport, consumerTransport?: WebRtcTransport) => {
    try {
        const transport = await createTransport(router);
        if (sender) {
            return producerTransport = transport;
        }
        return consumerTransport = transport;
    } catch (error) {
        throw new UniError(`error while creatin tranport for service ${error}`);
    }
}

const connectTransport = async (sender: boolean, dtlsParameters?: any, producerTransport?: WebRtcTransport, consumerTransport?: WebRtcTransport) => {
    if (sender) {
        return await producerTransport?.connect({ dtlsParameters });
    }
    return await consumerTransport?.connect({ dtlsParameters });
}

const producer = async (producerTransport: WebRtcTransport, kind: any, rtpParameters: any) => {
    try {
        return await producerTransport.produce({
            kind,
            rtpParameters
        });
    } catch (error) {
        throw new UniError(`error in producer ${error}`)
    }
}

const consumer = async (consumerTransport: WebRtcTransport, router: Router, producer: any, rtpCapabilities: any) => {
    try {
        if (!router.canConsume) throw new UniError("unable to consume data");
        router.canConsume({ producerId: producer.id, rtpCapabilities });
        return await consumerTransport.consume({
            producerId: producer?.id,
            rtpCapabilities,
            paused: false
        });
    } catch (error) {
        throw new UniError(`error in consumer ${error}`);
    }
}

export {
    getRouterRtpCapabilities,
    createTransportForService,
    connectTransport,
    producer,
    consumer
}