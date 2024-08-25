import { chatModel } from "../models/chatRoomData.model.nosql";
import mongoose from "mongoose";

const findUsers = async (roomName: string, AdminId?: string, userId?: string) => {
    try {
        return await chatModel.aggregate([
            {
                $match: {
                    roomName: roomName,
                    ...(AdminId && { AdminId: new mongoose.Types.ObjectId(AdminId) })
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
                    ...(userId && { "ChatUsers._id":new  mongoose.Types.ObjectId(userId) })
                }
            },
            {
                $project: {
                    _id:1,
                    roomName: 1,
                    AdminId: 1,
                    ChatUsers: 1,
                    UserCount:{$size:"$ChatUsers"},
                    encryptCode: 0
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