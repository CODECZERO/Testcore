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
import { ApiError } from "../util/apiError.js";
//redis is use for caching to store data realte to exam and chat room's
//usign env to load value of redis server
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
let client;
const connectReids = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client = createClient({ url: process.env.REDISURL });
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
        const data = yield client.setEx(tokenID, 86400, examID); //using strings in redis to store the exam token id and exam id 
        //the tokenID and examID is type of maping like tokenID:examID as the user has tokenID by which, the users can search examID 
        //which will return examID, which will later used for to search exam on the sql database
        //it's basicly storing the examID and tokenID on the redis database for caching
        if (!data)
            return null; //if data is not found in redis return null as the futher use of code have implement logic to reload the chache or update it 
        return data; //return data if present
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const cacheSearch = (tokenID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataSearch = yield client.get(tokenID); //taking and passing tokenID form the user and searching it on the redis
        //by searching it's returning examID which can be used in sql database for futher search of data
        if (!dataSearch)
            return null; //if data is not present return null as the further error handling can be implemented
        return dataSearch; //if data is present then return data
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const cacheSearchForChatRoom = (CollegeName, ClassRoomName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //this function spilt the college name and branch name
        if (!CollegeName || !ClassRoomName)
            throw new ApiError(500, "Invalid room name format"); //if it wasn't able to split theme throw erro
        //value are at 0th index
        const roomSearch = yield client.hGet(CollegeName, ClassRoomName); //if the college and branch name is provied then search theme in redis 
        //cache , the cache uses Hashe datatype as the one College can have many Brach
        //the output will be like this 
        /*
            "CollegeName":{
                "BranchName1":"MongodbId Of that chat room",
                "BranchName2":"MongodbId Of that chat room",
                "BranchName3":"MongodbId Of that chat room",
            }
        */
        if (!roomSearch)
            return null; //if data is not present return null as the further error handling can be implemented
        return roomSearch; //retunr the hashset or id of the chatroom and futher operation can be performed on it.
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
const cacheUpdateForChatRoom = (roomName, roomID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //using regex to spilt.
        //eg College/BranchName
        const CollegeName = roomName.match(/^\w+/); //College
        const ClassRoomName = roomName.match(/(?<=\/)\w+$/); //BrachName
        //this function spilt the college name and branch name
        if (!CollegeName || !ClassRoomName)
            throw new ApiError(500, "Invalid room name format"); //if it wasn't able to split theme throw erro
        //value are at 0th index
        const roomSearch = yield client.hSet(CollegeName[0], ClassRoomName[0], roomID);
        //the data will store like this 
        /*
            "CollegeName":{
                "BranchName1":"MongodbId Of that chat room",
                "BranchName2":"MongodbId Of that chat room",
                "BranchName3":"MongodbId Of that chat room",
            }
        */
        if (!roomSearch)
            return null; //if data is not present return null as the further error handling can be implemented
        return roomSearch; //retunr the hashset or id of the chatroom and futher operation can be performed on it.
    }
    catch (error) {
        throw new ApiError(500, error);
    }
});
export { cacheSearch, cacheUpdate, connectReids, cacheSearchForChatRoom, cacheUpdateForChatRoom };
