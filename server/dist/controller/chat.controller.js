var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AsyncHandler from "../util/ayscHandler";
import { ApiError } from "../util/apiError";
import { ApiResponse } from "../util/apiResponse";
import { cacheSearchForChatRoom, cacheUpdateForChatRoom } from "../db/database.redis.query";
import { chatModel } from "../models/chatRoomData.model.nosql";
import { User } from "../models/user.model.nosql";
import { findUsers } from "../db/Query.nosql.db";
import { nanoid } from "nanoid";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import { encryptDataFunc } from "../util/cryptographi.util";
//write this fnction
const joinChatRoom = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomdata = req.chatRoomData;
    const user = req.user;
    if (!roomdata || !user)
        throw new ApiError(400, "Inviad data provied");
    const findChatID = yield chatModel.findOne({
        romeName: roomdata.roomName,
    });
    if (!findChatID)
        throw new ApiError(404, "room not found");
    const joinChat = yield User.updateOne({
        chatRoomIDs: findChatID === null || findChatID === void 0 ? void 0 : findChatID._id,
    });
    //check chai aur backend as there is some command missing here
    if (!joinChat)
        throw new ApiError(500, "unable to join chat");
    return res.status(200).json(new ApiResponse(200, joinChat));
}));
const createChatRoom = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomData = req.chatRoomData;
    const { Id } = req.user;
    const encryptCode = "fsf";
    if (!Id || !roomData || !encryptCode)
        throw new ApiError(400, "group name or Admin id is not provided");
    const secretKey = nanoid(32);
    const iv = randomBytes(16);
    if (!(secretKey || iv))
        throw new ApiError(500, "error while making keys");
    const createRoom = yield chatModel.create({
        romeName: roomData.roomName,
        encryptCode: secretKey,
        AdminId: Id
    });
    if (!createRoom)
        throw new ApiError(500, "unable to create chat group");
    yield cacheUpdateForChatRoom(roomData.roomName, JSON.stringify(createRoom === null || createRoom === void 0 ? void 0 : createRoom._id));
    return res.status(200).json(new ApiResponse(200, createRoom));
}));
const getUserInChat = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomdata = req.chatRoomData;
    const { Id } = req.user;
    if (!roomdata)
        throw new ApiError(400, "Inviad data provied");
    const getUser = yield findUsers(roomdata.roomName, undefined, Id);
    if (!getUser)
        throw new ApiError(500, "unable to find total users");
    return res.status(200).json(new ApiResponse(200, getUser, "Total user"));
}));
const deleteChat = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatdata = req.chatRoomData;
    if (!chatdata)
        throw new ApiError(400, "invalid data");
    // const modifi = await ;
    // if (!modifi) throw new ApiError(500, "unable to delete chat");
    // return res.status(200).json(new ApiResponse(200, modifi, "message deleted"));
}));
const modifiChat = AsyncHandler(() => __awaiter(void 0, void 0, void 0, function* () {
}));
const SendMessageEncryption = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomData = cacheSearchForChatRoom();
    if (!(roomData || secretData))
        throw new ApiError(401, "secretData or roomData is not found");
    const encryptChatData = yield encryptDataFunc(req.body, secretData.secretKey, secretData.iv); //figure out how will you handle issue with 
    //kafka producer here
    return res.status(200).json(new ApiResponse(200, encryptChatData, "encrypt message data"));
}));
const ReciveMessageDecryption = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
const LeaveRoom = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomData = req.chatRoomData;
    const user = req.user;
    if (!(roomData || user))
        throw new ApiError(400, "invalid data");
    const findChatID = yield chatModel.findOne({
        romeName: roomData.roomName,
    });
    const removeUser = yield User.updateOne({ _id: new mongoose.Types.ObjectId(user.Id) }, { $pull: { chatRoomIDs: new mongoose.Types.ObjectId(findChatID === null || findChatID === void 0 ? void 0 : findChatID._id) } });
    if (!removeUser)
        throw new ApiError(406, "User unable to remove");
    return res.status(200).json(new ApiResponse(200, removeUser, "user remvoe"));
}));
const connectChat = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomData = req.chatRoomData;
    const user = req.user;
    if (!roomData)
        throw new ApiError(400, "invalid request");
    const checkUserAccess = yield User.aggregate([
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
    ]);
    if (!checkUserAccess || checkUserAccess.length === 0)
        throw new ApiError(409, "user don't have access to chat ");
    return res.status(200).json(new ApiResponse(200, checkUserAccess[0], "user have access to chat"));
}));
export { createChatRoom, joinChatRoom, connectChat, LeaveRoom, deleteChat, modifiChat, SendMessageEncryption, ReciveMessageDecryption, getUserInChat };
