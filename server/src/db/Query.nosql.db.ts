import { chatModel } from "../models/chatRoomData.model.nosql.js";
import { ApiError } from "../util/apiError.js";
import mongoose from "mongoose";

const findUsers = async (roomName: string, AdminId?: string, userId?: string) => {
    try {
        return await chatModel.aggregate([
            {
                $match: {
                    roomName: roomName,
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
                   "ChatUsers.sqlId":userId
                }
            },
            {
                $project: {
                    _id:1,
                    roomName: 1,
                    AdminId: 1,
                    ChatUsers: 1,
                    UserCount:{$size:"$ChatUsers"},
                }
            }
        ]);
    } catch (error) {
        throw new ApiError(500,`someting wnet worng while searching room ${error}`);
    }
};





export{
    findUsers
}