var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from "redis";
import { ApiError } from "../util/apiError";
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
let client;
const connectReids = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
        client.on('error', (err) => console.log('Redis Client Error', err));
        yield client.connect();
        console.log('Redis connected successfully');
        // You can now use the Redis client
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const cacheUpdate = (tokenID, examID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield client.setEx(tokenID, 86400, examID);
        if (!data)
            return null;
        return data;
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const cacheSearch = (tokenID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataSearch = yield client.get(`${tokenID}`);
        if (!dataSearch)
            return null;
        return dataSearch;
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const cacheSearchForChatRoom = (roomName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CollegeName = roomName.match(/^\w+/);
        const ClassRoomName = roomName.match(/(?<=\/)\w+$/);
        if (!CollegeName || !ClassRoomName)
            throw new Error("Invalid room name format");
        const roomSearch = yield client.hGet(CollegeName[0], ClassRoomName[0]);
        if (!roomSearch)
            return null;
        return roomName;
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const cacheUpdateForChatRoom = (roomName, roomID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CollegeName = roomName.match(/^\w+/);
        const ClassRoomName = roomName.match(/(?<=\/)\w+$/);
        if (!CollegeName || !ClassRoomName)
            throw new Error("Invalid room name format");
        const roomSearch = yield client.hSet(CollegeName[0], ClassRoomName[0], roomID);
        if (!roomSearch)
            return null;
        return roomName;
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
export { cacheSearch, cacheUpdate, connectReids, cacheSearchForChatRoom, cacheUpdateForChatRoom };
