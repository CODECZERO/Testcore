import { chatModel } from "../models/chatRoomData.model.nosql.js";
import mongoose from "mongoose";

const findUsers = async (roomID: string, AdminId?: string, userId?: string) => {
    try {
        return await chatModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(roomID),
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
        return error;
    }
};





export{
    findUsers
}