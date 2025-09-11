var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { cacheSearchForChatRoom } from "../db/database.redis.query.js";
const SearchChatRoom = AsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roomID = yield cacheSearchForChatRoom(req.params.roomName); //check for chat room in cache
    if (!(roomID))
        throw new ApiError(404, "chat room not found, make sure it's register");
    const roomName = req.params.roomName; //room name would be collegeName/branch
    req.chatRoomData = { roomID, roomName }; //then return that data in req.chatRoomData object
    next();
}));
export { SearchChatRoom };
