import { WebSocketServer, WebSocket } from "ws";
import mediasoup from "mediasoup";
import { UniError } from "../../util/UniErrorHandler.js";
import { createTransportForService, getRouterRtpCapabilities, } from "./videoMethodes.services.js";
import { createRouter,createWorker } from "./videoCoreMethode.services.js";



/*
    Video message parameter, so the function can be performed according to the message

    type VideoMessage={
        actionType:actionType,
        sender:boolean,
        dtlsParameters:dtlsParameters,

    }
*/

interface CustomWebSocket extends WebSocket{

}

type actionType="getRouterRtpCapabilities"|"createTransport"|"connectTransport"|"produce"|"consume";
type message={
    actionType:actionType,
}

let router: mediasoup.types.Router;
let producerTransport: mediasoup.types.WebRtcTransport;
let consumerTransport: mediasoup.types.WebRtcTransport;
let producer: mediasoup.types.Producer;
let consumer: mediasoup.types.Consumer;

const port: number = process.env.WEBSOCKETPORTVIDEO ? Number(process.env.WEBSOCKETPORTVIDEO) : 3000;//running websocket on same webserver but different port,
const wss = new WebSocketServer({ port });
const action={
    "getRouterRtpCapabilities":getRouterRtpCapabilities,
    "createTransport":createTransportForService,
    "connectTransport":,
    "produce":,
    "consume":,
}

const runVideoServer = async () => {
    wss.on('connection', (ws: WebSocket, req: Request) => {
        // const token = VideoTokenExtracter();
        // if (!token) {//for some reason , i am feeling that it can lead to vulnerability
        //     ws.close(4000, "Invalid request,User not have access to this group");
        //     return;
        // }

        ws.on('message',(message:message)=>{
            const actionType=message.actionType;
            const output=action[actionType](ws,actionType,router);
          
        })

        ws.on('close',()=>{
            ws.send("close");
            return;
        })
    })

}

export { runVideoServer };