import {Request, Response, NextFunction } from "express";
import { WebSocketServer,WebSocket } from "ws";
import AsyncHandler from "../../util/ayscHandler.js";
import { ApiError } from "../../util/apiError.js";
const rooms: any = {};
const port: number = process.env.WEBSOCKETPORT ? Number(process.env.WEBSOCKETPORT) : 3000;
const wss = new WebSocketServer({port});
let ws:WebSocket;
let parameters;
let roomName:string;

const joinRoom = async(ws:any)=>{
   try {
     if (!rooms[roomName]) {
        rooms[roomName] = new Set();
     }
     console.log(roomName)
     rooms[roomName].add(ws);
   } catch (error) {
        return new ApiError(500,"error while find and storing room");
   }
}

const sendMessage = async (messageBuffer: Buffer, roomName: string) => {
    try {
        rooms[roomName].forEach((client: WebSocket) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(messageBuffer);
          }
        });
    } catch (error) {
      return new ApiError(500,"error while sending message");
    }
}

const closeSocket=async(ws:WebSocket,roomName:string)=>{
   try {
     rooms[roomName].delete(ws);
     if (rooms[roomName].size === 0) {
         delete rooms[roomName];
     }
   } catch (error) {
        return new ApiError(500,"error while closeing socket")
   }
}




const runWebSocket=async(roomName:string)=>{
    console.log(roomName);

    try {
        wss.on('connection', async (ws) => {
            await joinRoom(ws);
            console.log("on");
            ws.on('message',async (message)=>{
             const messageBuffer = Buffer.from(message as Uint8Array);
             await sendMessage(messageBuffer,roomName);
            })
         
            ws.on('close',()=>{
                 closeSocket(ws,roomName);
            })
         })
    } catch (error) {
        throw new ApiError(500,"Error while runing websocket");
    }
}

export default runWebSocket;