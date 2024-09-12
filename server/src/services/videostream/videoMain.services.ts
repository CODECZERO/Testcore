import { WebSocketServer, WebSocket } from "ws";
import mediasoup from "mediasoup";
import { UniError } from "../../util/UniErrorHandler.js";
import videoMethode from "./videoMethodes.services.js";
import { DtlsParameters } from "mediasoup/node/lib/fbs/web-rtc-transport.js";
import { RtpParameters } from "mediasoup/node/lib/fbs/rtp-parameters.js";


/*
    Video message parameter, so the function can be performed according to the message

    type VideoMessage={
        actionType:actionType,
        sender:boolean,
        dtlsParameters:dtlsParameters,

    }
*/

interface CustomWebSocket extends WebSocket {

}

type actionType = "getRouterRtpCapabilities" | "createTransport" | "connectTransport" | "produce" | "consume";

type message = {
    actionType: actionType,
    dtlsParameters:DtlsParameters,
    kind:any,
    rtpParameters:RtpParameters

}

let router: mediasoup.types.Router;
let producerTransport: mediasoup.types.WebRtcTransport;
let consumerTransport: mediasoup.types.WebRtcTransport;
let producer: mediasoup.types.Producer;
let consumer: mediasoup.types.Consumer;
let connectTransport:mediasoup.types.WebRtcTransport;

const port: number = process.env.WEBSOCKETPORTVIDEO ? Number(process.env.WEBSOCKETPORTVIDEO) : 3000;//running websocket on same webserver but different port,
const wss = new WebSocketServer({ port });



const runVideoServer = async () => {
    router = await videoMethode.startConnection(router);
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
                        producerTransport = await videoMethode.createTransportForService(router, true, producerTransport);
                        const transportParams = {
                            id: producerTransport.id,
                            iceParameters: producerTransport.iceParameters,
                            iceCandidates: producerTransport.iceCandidates,
                            dtlsParameters: producerTransport.dtlsParameters,
                        };
                        ws.send(JSON.stringify(transportParams));
                        break;

                    case "connectTransport":
                            connectTransport=await videoMethode.connectTransport(false,messageData.dtlsParameters,producerTransport);
                            ws.send("connected");
                        break;
                    case "consume":

                        break;
                    case "produce":
                        
                        producer=await videoMethode.producer(producerTransport,messageData.kind,messageData.rtpParameters);
                        console.log(producer)
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

export { runVideoServer };