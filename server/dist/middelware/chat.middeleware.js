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
import jwt from 'jsonwebtoken';
const SearchChatRoom = AsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const findRoom = yield cacheSearchForChatRoom(req.params.College, req.params.Branch);
    if (!findRoom)
        throw new ApiError(404, "chat room not found, make sure it's register");
    req.chatRoomData = findRoom;
    next();
}));
const encryptDecryptData = AsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const request = req;
        const headertoken = req.get("Authorization"); // Correctly getting the Authorization header
        const token = ((_a = request.cookies) === null || _a === void 0 ? void 0 : _a.accesToken) || (headertoken === null || headertoken === void 0 ? void 0 : headertoken.replace("Bearer ", "")); // Handling cookies and headers
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        // Verify the token here
        const secert = process.env.ATS;
        const decoded = yield jwt.verify(token, secert);
        const { email, role } = decoded;
        request.user = decoded; // Assuming `req.user` is where you store the decoded token
        next();
    }
    catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid secret key"));
    }
}));
export { SearchChatRoom };
