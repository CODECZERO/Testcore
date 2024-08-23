import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { WebSocket } from "ws";

const connectChat = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const roomNameUrl = req.url.valueOf();
    if (!roomNameUrl) throw new ApiError(400, "room name is not provided");
    const ws = new WebSocket("ws://localhost:9000");
    ws.onopen = () => {
        // Room name could be set here or retrieved from some UI input
        const roomName = roomNameUrl;
        const message = "Hello, room!";

        // Sending message along with the room name
        ws.send(JSON.stringify({ roomName, message }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data as string);
        console.log("Received:", data.message);
    };

});

export default connectChat;