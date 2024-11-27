import { WebSocketServer, WebSocket } from "ws";
import mediasoup from "mediasoup";
import { UniError } from "../../util/UniErrorHandler.js";
import videoMethode from "./videoMethodes.services.js";
import { DtlsParameters } from "mediasoup/node/lib/fbs/web-rtc-transport.js";
import { RtpParameters } from "mediasoup/node/lib/fbs/rtp-parameters.js";
import { RtpCapabilities } from "mediasoup/node/lib/RtpParameters.js";
import { nanoid } from "nanoid";
import { Router, WebRtcTransport } from "mediasoup/node/lib/types.js";
import { getVideoServerTransport, removeVideoServerTranspor, setVideoServerTransport } from "../../db/database.redis.query.js";


/*
    Video message parameter, so the function can be performed according to the message

    type VideoMessage={
        actionType:actionType,
        sender:boolean,
        dtlsParameters:dtlsParameters,

    }
*/

interface userTransport {
    Transport: mediasoup.types.WebRtcTransport;
}



type actionType = "getRouterRtpCapabilities" | "createTransport" | "connectTransport" | "produce" | "consume" | "remove";

type message = {
    actionType: actionType,
    dtlsParameters: DtlsParameters,
    kind: any,
    rtpParameters: RtpParameters,
    producerId: any;
    rtpCapabilities: RtpCapabilities,
    Id: string

}

let Transport = new Map<string, userTransport>();
let producerTransport: mediasoup.types.Producer;
let connectTransport: mediasoup.types.WebRtcTransport;


const port: number = process.env.WEBSOCKETPORTVIDEO ? Number(process.env.WEBSOCKETPORTVIDEO) : 9022;//running websocket on same webserver but different port,
const wss = new WebSocketServer({ port });



const runVideoServer = async () => {
    const router: Router = await videoMethode.startConnection();
    wss.on('connection', (ws: WebSocket, req: Request) => {
        // const token = VideoTokenExtracter();
        // if (!token) {//for some reason , i am feeling that it can lead to vulnerability
        //     ws.close(4000, "Invalid request,User not have access to this group");
        //     return;
        // }

        ws.on('message', async (message: string) => {
            try {
                const messageData: message = JSON.parse(message);
                switch (messageData.actionType) {
                    case 'getRouterRtpCapabilities':
                        await videoMethode.getRouterRtpCapabilities(ws, router);
                        break;

                    case "createTransport":
                        const id = nanoid(12);
                        const TransportData = await videoMethode.createTransportForService(router, true, producerTransport);

                        const transportParams = {
                            id: TransportData.id,
                            iceParameters: TransportData.iceParameters,
                            iceCandidates: TransportData.iceCandidates,
                            dtlsParameters: TransportData.dtlsParameters,
                        };

                        await setVideoServerTransport(id,TransportData)
                        ws.send(JSON.stringify({ "Id": id, transportParams }));
                        break;

                    case "connectTransport":
                        const producerTransportxL = await getVideoServerTransport(messageData.Id);
                        connectTransport = await videoMethode.connectTransport(false, messageData.dtlsParameters, producerTransportxL as any);
                        ws.send("connected");
                        break;

                    case "consume":
                        const consumerTransportL = await getVideoServerTransport(messageData.Id)
                        const consumer = await videoMethode.consumer(consumerTransportL as any, router, messageData.producerId, messageData.rtpCapabilities);
                        ws.send(JSON.stringify(consumer));
                        break;

                    case "produce":
                        const producerTransportL = await getVideoServerTransport(messageData.Id)
                        const producer = await videoMethode.producer(producerTransportL as any, messageData.kind, messageData.rtpParameters);
                        ws.send(JSON.stringify(producer));
                        break;

                    case "remove":
                        await removeVideoServerTranspor(messageData.Id);
                        ws.send("Removed");
                        break;

                    default:
                        ws.send("action/message action wasn't define");
                        ws.close(4004);
                        break;

                }
            } catch (error) {
                ws.close(5000, `Some error occure ${error}`);
            }
        })

        ws.on('close', () => {
            ws.send("close");
            return;
        })
    })

}


const closeVideoServer=async()=>{//close video server
    try {
        wss.close();
    } catch (error) {
        return error;
    }
}
export { runVideoServer, userTransport,closeVideoServer };