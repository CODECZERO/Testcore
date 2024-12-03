import { chatModel } from "../models/chatRoomData.model.nosql.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.nosql.js";
import { error, profile } from "console";

const findUsers = async (roomID: string, AdminId?: string, userId?: string) => {//this function user in chatroom
    try {
        return await chatModel.aggregate([//use's aggreagation
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(roomID),//matchs _id with roomID
                }
            },
            {
                $lookup: {//looks in user collection
                    from: "users",
                    localField: "_id",
                    foreignField: "chatRoomIDs",
                    as: "ChatUsers",
                }
            },
            {
                $match: {
                    "ChatUsers.sqlId": userId//match sqlid with userid in chatuser, ensuring that user have access to chat
                }
            },
            {
                $project: {//return data in this format
                    _id: 1,
                    roomName: 1,
                    AdminId: 1,
                    ChatUsers: 1,
                    UserCount: { $size: "$ChatUsers" },
                }
            }
        ]);
    } catch (error) {
        return error;
    }
};

//this function help us to find the number of chat per user and data realted to chat 

const findChats = async (userId?: string) => {
    try {
        const chat = await User.aggregate([
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
    } catch (error) {
        return error;
    }
}
export {
    findUsers,
    findChats
}