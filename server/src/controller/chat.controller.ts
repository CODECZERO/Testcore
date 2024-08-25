import AsyncHandler from "../util/ayscHandler";
import { ApiError } from "../util/apiError";
import { ApiResponse } from "../util/apiResponse";
import { cacheUpdateForChatRoom } from "../db/database.redis.query";
import { Response, Request } from "express";
import { chatModel } from "../models/chatRoomData.model.nosql";
import { User } from "../models/user.model.nosql";
import { findUsers } from "../db/Query.nosql.db";
import { nanoid } from "nanoid";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import { encryptDataFunc } from "../util/cryptographi.util";


type roomData = {
    roomName: string,
    roomID: string
}

type chatData = {
    chatID: string
}

type user = {
    Id: string
}

type encryption={
    secretKey:string,
    iv:string

}

interface Requestany extends Request {
    chatRoomData?: any,
    user?: any,
    chatEncryption?:any
}



//write this fnction
const joinChatRoom = AsyncHandler(async (req: Requestany, res: Response) => {
    const roomdata: roomData = req.chatRoomData;
    const user: user = req.user;
    if (!roomdata || !user) throw new ApiError(400, "Inviad data provied");
    const findChatID = await chatModel.findOne({
        romeName: roomdata.roomName,
    });
    if (!findChatID) throw new ApiError(404, "room not found");

    const joinChat = await User.updateOne({
        chatRoomIDs: findChatID?._id,
    });
    //check chai aur backend as there is some command missing here
    if (!joinChat) throw new ApiError(500, "unable to join chat");
    return res.status(200).json(new ApiResponse(200, joinChat));
});

const createChatRoom = AsyncHandler(async (req: Requestany, res: Response) => {
    const roomData: roomData = req.chatRoomData;
    const { Id } = req.user;
    const encryptCode = "fsf";
    if (!Id || !roomData || !encryptCode) throw new ApiError(400, "group name or Admin id is not provided");
    const secretKey=nanoid(32);
    const iv = randomBytes(16);
    if(!(secretKey||iv)) throw new ApiError(500,"error while making keys");
    const createRoom = await chatModel.create({
        romeName: roomData.roomName,
        encryptCode:secretKey,
        AdminId: Id
    });
    if (!createRoom) throw new ApiError(500, "unable to create chat group");
    await cacheUpdateForChatRoom(roomData.roomName, JSON.stringify(createRoom?._id));
    return res.status(200).json(new ApiResponse(200, createRoom));
});

const getUserInChat = AsyncHandler(async (req: Requestany, res: Response) => {
    const roomdata: roomData = req.chatRoomData;
    const { Id } = req.user;
    if (!roomdata) throw new ApiError(400, "Inviad data provied");
    const getUser = await findUsers(roomdata.roomName, undefined, Id);
    if (!getUser) throw new ApiError(500, "unable to find total users");
    return res.status(200).json(new ApiResponse(200, getUser, "Total user"));

});

const deleteChat = AsyncHandler(async (req: Requestany, res: Response) => {
    const chatdata: chatData = req.chatRoomData;
    if (!chatdata) throw new ApiError(400, "invalid data");
    // const modifi = await ;
    // if (!modifi) throw new ApiError(500, "unable to delete chat");
    // return res.status(200).json(new ApiResponse(200, modifi, "message deleted"));

});

const modifiChat = AsyncHandler(async () => {

});

const SendMessage = AsyncHandler(async (req:Requestany,res:Response) => {
    const roomData:roomData=req.chatRoomData;
    const secretData:encryption=req.chatEncryption;
    const encryptChatData=await encryptDataFunc(req.body,secretData.secretKey,secretData.iv as Buffer);//figure out how will you handle issue with 
   
    //kafka producer here
    return res.status(200).json(new ApiResponse(200,encryptChatData,"encrypt message data"));

});

const ReciveMessage = AsyncHandler(async (req:Requestany,res:Response) => {// this function should be taken care on user/client side 

});

const LeaveRoom = AsyncHandler(async (req: Requestany, res: Response) => {
    const roomData: roomData = req.chatRoomData;
    const user: user = req.user;
    if (!(roomData || user)) throw new ApiError(400, "invalid data");
    const findChatID = await chatModel.findOne({
        romeName: roomData.roomName,
    });
    const removeUser = await User.updateOne({ _id: new mongoose.Types.ObjectId(user.Id) }, { $pull: { chatRoomIDs: new mongoose.Types.ObjectId(findChatID?._id) } });
    if (!removeUser) throw new ApiError(406, "User unable to remove");
    return res.status(200).json(new ApiResponse(200, removeUser, "user remvoe"))
});


const connectChat = AsyncHandler(async (req: Requestany, res: Response) => {//checks wheater user is part of that chat room
    const roomData: roomData = req.chatRoomData;
    const user: user = req.user;
    if (!roomData) throw new ApiError(400, "invalid request");
    const checkUserAccess = await User.aggregate([
        {
            $match: {
                sqlId: new mongoose.Types.ObjectId(user.Id),
                chatRoomIDs: { $eq: new mongoose.Types.ObjectId(roomData.roomID) }
            }
        },
        {
            $lookup: {
                from: "chatmodels",
                localField: "chatRoomIDs",
                foreignField: "_id",
                as: "ChatUsers"
            }
        },
        {
            $project: {
                _id: 1,
                ChatUsers: 1,
            }
        }

    ])
    if (!checkUserAccess || checkUserAccess.length === 0) throw new ApiError(409, "user don't have access to chat ");


    return res.status(200).json(new ApiResponse(200, checkUserAccess[0], "user have access to chat"));

});

export {
    createChatRoom,
    joinChatRoom,
    connectChat,
    LeaveRoom,
    deleteChat,
    modifiChat,
    SendMessage,
    ReciveMessage,
    getUserInChat
}