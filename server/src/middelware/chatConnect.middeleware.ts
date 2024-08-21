import { NextFunction } from "express";
import runWebSocket from "../services/chat/chat.service";
import { run } from "node:test";

const connectChat=async(req:Request,res:Response,next:NextFunction)=>{
    const roomName=req.url.valueOf();
    await runWebSocket(roomName);
}