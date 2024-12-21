import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { cacheSearchForChatRoom } from "../db/database.redis.query.js";


interface Requestany extends Request {
    chatRoomData?: any;
}


const SearchChatRoom = AsyncHandler(async (req: Requestany, res: Response, next: NextFunction) => {//this function check if chat room exists for that college and branch
    const roomID = await cacheSearchForChatRoom(req.params.roomName[0]);//check for chat room in chace
    if (!(roomID)) throw new ApiError(404, "chat room not found, make sure it's register");
    const roomName = req.params.roomName;//room name would be collegeName/branch
    req.chatRoomData = { roomID, roomName };//then return that data in req.chatRoomData object
    next();
});


export {
    SearchChatRoom
};