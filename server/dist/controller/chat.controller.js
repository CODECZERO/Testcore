var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AsyncHandler from '../util/ayscHandler.js';
import { ApiResponse } from '../util/apiResponse.js';
import { cacheUpdateForChatRoom, } from '../db/database.redis.query.js';
import { chatModel } from '../models/chatRoomData.model.nosql.js';
import { User } from '../models/user.model.nosql.js';
import { findChats, findUsers } from '../db/Query.nosql.db.js';
import mongoose from 'mongoose';
import { ApiError } from '../util/apiError.js';
import { options } from './user.controller.js';
import { ChatTokenGen } from '../services/chat/chatToken.services.js';
const joinChatRoom = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomdata = req.chatRoomData; //takes data about room
    const user = req.user; //takes user id or uder data
    if (!roomdata.roomName || !user.Id)
        throw new ApiError(400, 'Inviad data provied'); //if any of theme is not provided then throw error
    const findChatID = yield chatModel.findOne({
        romeName: roomdata.roomName,
    });
    if (!findChatID)
        throw new ApiError(404, 'room not found');
    const joinChat = yield User.updateOne({
        sqlId: user.Id
    }, {
        chatRoomIDs: findChatID._id, //taking chat id and puting here
    });
    if (!joinChat)
        throw new ApiError(500, 'unable to join chat'); //if unable to do so , then throw error
    return res.status(200).json(new ApiResponse(200, joinChat)); //else return value
}));
const createChatRoom = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomData = req.body;
    const { Id } = req.user; //takes data from client
    if (!Id || !roomData.roomName)
        throw new ApiError(400, 'group name or Admin id is not provided'); //if not provided then throw error
    const user = yield User.findOne({
        sqlId: Id
    });
    if (!user)
        throw new ApiError(404, "No user Found");
    const createRoom = yield chatModel.create({
        romeName: roomData.roomName,
        AdminId: user === null || user === void 0 ? void 0 : user._id,
    });
    if (!(createRoom))
        throw new ApiError(500, 'unable to create chat group');
    yield cacheUpdateForChatRoom(//updating data in cahce so it's , easly accessed
    roomData.roomName, JSON.stringify(createRoom === null || createRoom === void 0 ? void 0 : createRoom._id));
    return res.status(200).json(new ApiResponse(200, createRoom)); //return data
}));
const getUserInChat = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomdata = req.chatRoomData;
    const { Id } = req.user; //takes data from client
    if (!roomdata)
        throw new ApiError(400, 'Inviad data provied');
    const getUser = yield findUsers(roomdata.roomID.replace(/"/g, ''), undefined, Id); //get user using findUsers function which is a mongoose nested query
    if (!getUser)
        throw new ApiError(500, 'unable to find total users');
    return res.status(200).json(new ApiResponse(200, getUser, 'Total user')); //return data on success
}));
// const SendMessageEncryption = AsyncHandler(async () => {
//      const roomData:roomData=cacheSearchForChatRoom();
//      if(!(roomData||secretData)) throw new ApiError(401,"secretData or roomData is not found")
//     const encryptChatData=await encryptDataFunc(req.body,secretData.secretKey,secretData.iv as Buffer);//figure out how will you handle issue with
// });
// const ReciveMessageDecryption = AsyncHandler(async (req:Requestany,res:Response) => {// this function should be taken care on user/client side
// });
const LeaveRoom = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //it removes the users from that particure chat permantly
    const roomData = req.chatRoomData;
    const user = req.user;
    if (!(roomData || user))
        throw new ApiError(400, 'invalid data');
    const findChatID = yield chatModel.findOne({
        romeName: roomData.roomName,
    });
    const removeUser = yield User.updateOne(//after that remove user from chat group
    { sqlId: user.Id }, { $pull: { chatRoomIDs: new mongoose.Types.ObjectId(findChatID === null || findChatID === void 0 ? void 0 : findChatID._id) } });
    if (!removeUser)
        throw new ApiError(406, 'User unable to remove');
    return res.status(200).json(new ApiResponse(200, removeUser, 'user remvoe')); //return data
}));
const checkUserAccess = (userId, roomID) => __awaiter(void 0, void 0, void 0, function* () {
    //checks wheater user is part of that chat room
    //it a function which is used in other controler
    try {
        const checkUserChatAccess = yield User.aggregate([
            {
                $match: {
                    sqlId: new mongoose.Types.ObjectId(userId),
                    chatRoomIDs: { $eq: new mongoose.Types.ObjectId(roomID) }, //and also take room id of chat
                },
            },
            {
                $lookup: {
                    from: 'chatmodels',
                    localField: 'chatRoomIDs',
                    foreignField: '_id',
                    as: 'ChatUsers',
                },
            },
            {
                $project: {
                    _id: 1,
                    ChatUsers: 1,
                },
            },
        ]);
        if (!checkUserChatAccess || checkUserChatAccess.length === 0)
            throw new ApiError(409, "user don't have access to chat "); //if data is 0 and some how not provided then throw error
        return checkUserChatAccess[0]; //else reutnr first value
    }
    catch (error) {
        return new ApiError(500, "Something went wrong while checking user access");
    }
});
const connectChat = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomData = req.chatRoomData; //takes parametrs
    const user = req.user;
    if (!roomData)
        throw new ApiError(400, 'invalid request'); //throw error if not provided
    const Checker = yield checkUserAccess(user.Id, roomData.roomID); //check in database if user have access to the chat room
    if (!Checker)
        throw new ApiError(409, "user don't have access to chat"); //if fail then throw error
    //call token generater here
    const tokenGen = yield ChatTokenGen(Checker[0]); //takes first value and gen token based on that data
    if (!tokenGen)
        throw new ApiError(500, "someting went wrong while making token"); //if token not gen then throw error
    return res.status(200).cookie("UserChatToken", tokenGen, options).json(new ApiResponse(200, Checker, "Token create succesfuly")); //reutrn response
}));
const getChats = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user.Id)
        throw new ApiError(400, "user id not provied");
    const ChatDatas = yield findChats(user.Id);
    if (!ChatDatas)
        throw new ApiError(404, "no chat room currently");
    return res.status(200).json(new ApiResponse(200, ChatDatas, "chat rooms found"));
}));
export { createChatRoom, joinChatRoom, checkUserAccess, LeaveRoom, getUserInChat, connectChat, getChats };
