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
import { findUsers } from '../db/Query.nosql.db.js';
import { nanoid } from 'nanoid';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { clients, rooms } from '../services/chat/chatServer.service.js';
import rabbitmq from '../services/rabbitmq/rabbitmq.services.js';
import { ApiError } from '../util/apiError.js';
//write this fnction
const joinChatRoom = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomdata = req.chatRoomData;
    const user = req.user;
    if (!roomdata || !user)
        throw new ApiError(400, 'Inviad data provied');
    const findChatID = yield chatModel.findOne({
        romeName: roomdata.roomName,
    });
    if (!findChatID)
        throw new ApiError(404, 'room not found');
    const joinChat = yield User.updateOne({
        chatRoomIDs: findChatID === null || findChatID === void 0 ? void 0 : findChatID._id,
    });
    //check chai aur backend as there is some command missing here
    if (!joinChat)
        throw new ApiError(500, 'unable to join chat');
    return res.status(200).json(new ApiResponse(200, joinChat));
}));
const createChatRoom = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomData = req.chatRoomData;
    const { Id } = req.user;
    const encryptCode = 'fsf';
    if (!Id || !roomData || !encryptCode)
        throw new ApiError(400, 'group name or Admin id is not provided');
    const secretKey = nanoid(32);
    const iv = randomBytes(16);
    if (!(secretKey || iv))
        throw new ApiError(500, 'error while making keys');
    const createRoom = yield chatModel.create({
        romeName: roomData.roomName,
        encryptCode: secretKey,
        AdminId: Id,
    });
    if (!createRoom)
        throw new ApiError(500, 'unable to create chat group');
    yield cacheUpdateForChatRoom(roomData.roomName, JSON.stringify(createRoom === null || createRoom === void 0 ? void 0 : createRoom._id));
    return res.status(200).json(new ApiResponse(200, createRoom));
}));
const getUserInChat = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomdata = req.chatRoomData;
    const { Id } = req.user;
    if (!roomdata)
        throw new ApiError(400, 'Inviad data provied');
    const getUser = yield findUsers(roomdata.roomName, undefined, Id);
    if (!getUser)
        throw new ApiError(500, 'unable to find total users');
    return res.status(200).json(new ApiResponse(200, getUser, 'Total user'));
}));
const deleteChat = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //cruently working on this feature
    const chatdata = req.chatRoomData;
    if (!chatdata)
        throw new ApiError(400, 'invalid data');
    // const modifi = await ;
    // if (!modifi) throw new ApiError(500, "unable to delete chat");
    // return res.status(200).json(new ApiResponse(200, modifi, "message deleted"));
}));
const modifiChat = AsyncHandler(() => __awaiter(void 0, void 0, void 0, function* () { }));
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
    const removeUser = yield User.updateOne({ _id: new mongoose.Types.ObjectId(user.Id) }, { $pull: { chatRoomIDs: new mongoose.Types.ObjectId(findChatID === null || findChatID === void 0 ? void 0 : findChatID._id) } });
    if (!removeUser)
        throw new ApiError(406, 'User unable to remove');
    return res.status(200).json(new ApiResponse(200, removeUser, 'user remvoe'));
}));
const connectChat = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //checks wheater user is part of that chat room
    const roomData = req.chatRoomData;
    const user = req.user;
    if (!roomData)
        throw new ApiError(400, 'invalid request');
    const checkUserAccess = yield User.aggregate([
        {
            $match: {
                sqlId: new mongoose.Types.ObjectId(user.Id),
                chatRoomIDs: { $eq: new mongoose.Types.ObjectId(roomData.roomID) },
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
    if (!checkUserAccess || checkUserAccess.length === 0)
        throw new ApiError(409, "user don't have access to chat ");
    return res
        .status(200)
        .json(new ApiResponse(200, checkUserAccess[0], 'user have access to chat'));
}));
const sendMessage = (MessageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageInfo = JSON.stringify(MessageData); //converts message pattern to string or json to string
        // const messageEnc=await SendMessageEncryption();//it a enctyption function, which encrypts message bfore sending,it to queue
        //so only the user/group/group member person can only open/read that message
        rabbitmq.publishData(JSON.stringify(MessageData), MessageData.roomName); //publishing or send data to rabbitmq queue, so it can make record of message for 7 day
        //or for user defin time and it's a way of scaling the whole chat feature/application, insted of rabbitmq you can use kafka as it will be fast and quit robust
    }
    catch (error) {
        throw new ApiError(500, "error while sending message"); //throw error if any thing went wrong, so later the dev can debug it 
    }
});
const sendMessageToReciver = (message, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield clients.forEach(client => {
            if (message && client != ws && client.readyState === ws.OPEN) { //checks, if webscoket and message exist,if the set of websocket or websocket is ready
                //or open,then send message 
                client.send(JSON.stringify(message)); //takes message from rabbitmq queue
            }
        });
    }
    catch (error) {
        throw new ApiError(500, "error while receiving message"); //throw error if any thing went wrong, so later the dev can debug it 
    }
});
const reciveMEssage = (roomName, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageEnc = yield rabbitmq.subData(roomName); //subscribe to the queue, the queue name is same as roomName 
        yield rabbitmq.channel.consume(rabbitmq.queue.queue, (message) => {
            //send it to user 
            if (message)
                sendMessageToReciver(message, ws);
        });
    }
    catch (error) {
        throw new ApiError(500, "error while reciveing message"); //throw error if any thing went wrong, so later the dev can debug it 
    }
});
const closeSocket = (MessageData, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        rooms[MessageData.roomName].delete(ws); //checks the roomName in the collection of the rooms and removes the websocket connection from that room
        //rooms is a object which has information about how many users are connected to server as any user close's or end the connection with server
        //it will remove user from object 
        if (rooms[MessageData.roomName].size === 0) { //if there is no one in the current websocket server of that room or user of a room are not connected to the
            //websocket, it will delete the room from the rooms(object of room);.
            delete rooms[MessageData.roomName];
        }
    }
    catch (error) {
        throw new ApiError(500, "error while closeing socket"); //throw error if any thing went wrong, so later the dev can debug it 
    }
});
const closeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rabbitmq.closeConnection();
    }
    catch (error) {
        throw new ApiError(500, "error while closeing connection"); //throw error if any thing went wrong, so later the dev can debug it 
    }
});
export { createChatRoom, joinChatRoom, connectChat, LeaveRoom, deleteChat, modifiChat, 
// SendMessageEncryption,
// ReciveMessageDecryption,
getUserInChat, sendMessage, reciveMEssage, closeSocket, closeConnection };
