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
import { ApiError } from "../util/apiError.js";
const findUsers = (roomName, AdminId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield chatModel.aggregate([
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
                    "ChatUsers.sqlId": userId
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
        throw new ApiError(500, `someting wnet worng while searching room ${error}`);
    }
});
export { findUsers };
