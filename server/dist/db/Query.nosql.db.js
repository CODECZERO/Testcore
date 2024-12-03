var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { chatModel } from "../models/chatRoomData.model.nosql.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.nosql.js";
const findUsers = (roomID, AdminId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield chatModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(roomID), //matchs _id with roomID
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "chatRoomIDs",
                    as: "ChatUsers",
                }
            },
            {
                $match: {
                    "ChatUsers.sqlId": userId //match sqlid with userid in chatuser, ensuring that user have access to chat
                }
            },
            {
                $project: {
                    _id: 1,
                    roomName: 1,
                    AdminId: 1,
                    ChatUsers: 1,
                    UserCount: { $size: "$ChatUsers" },
                }
            }
        ]);
    }
    catch (error) {
        return error;
    }
});
//this function help us to find the number of chat per user and data realted to chat 
const findChats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield User.aggregate([
            {
                $match: {
                    sqlId: userId
                }
            },
            {
                $lookup: {
                    from: "chatmodels",
                    localField: "chatRoomIDs",
                    foreignField: "_id",
                    as: "chatData"
                }
            },
            {
                $project: {
                    profile: 1,
                    chatData: {
                        roomName: 1,
                        _id: 1
                    }
                }
            }
        ]);
        return chat;
    }
    catch (error) {
        return error;
    }
});
export { findUsers, findChats };
