import { createClient } from "redis";
import { ApiError } from "../util/apiError.js";
import { RedisClientType } from "@redis/client";
import { ApiResponse } from "../util/apiResponse.js";

//redis is use for caching to store data realte to exam and chat room's
//usign env to load value of redis server
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

let client: RedisClientType;
const connectReids = async () => {//connecting redis
    try {
        client = createClient({ url: process.env.REDISURL });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        console.log('Redis connected successfully');

        // You can now use the Redis client
    } catch (error) {
        throw new ApiError(500, error);
    }
}

const cacheUpdate = async (tokenID: string, examID: string) => {//using this function to update redis chache
    try {
        const data = await client.setEx(tokenID, 86400, examID);//using strings in redis to store the exam token id and exam id 
        //the tokenID and examID is type of maping like tokenID:examID as the user has tokenID by which, the users can search examID 
        //which will return examID, which will later used for to search exam on the sql database
        //it's basicly storing the examID and tokenID on the redis database for caching
        if (!data) return null;//if data is not found in redis return null as the futher use of code have implement logic to reload the chache or update it 
        return data//return data if present
    } catch (error) {
        throw new ApiError(500, error);
    }
}

const cacheSearch = async (tokenID: string) => {//this function to search tokenId on redis database
    try {
        const dataSearch = await client.get(tokenID);//taking and passing tokenID form the user and searching it on the redis
        //by searching it's returning examID which can be used in sql database for futher search of data
        if (!dataSearch) return null;//if data is not present return null as the further error handling can be implemented
        return dataSearch//if data is present then return data
    } catch (error) {
        throw new ApiError(500, error);
    }
}

const cacheSearchForChatRoom = async (roomName:string) => {//this function takes room name from user and search it on redis 
    try {
        //this function spilt the college name and branch name
        if (!roomName) throw new ApiError(500, "Invalid room name format");//if it wasn't able to split theme throw erro
        //value are at 0th index
        const roomSearch = await client.hGet(roomName,roomName);//if the college and branch name is provied then search theme in redis 
        //cache , the cache uses Hashe datatype as the one College can have many Brach
        //the output will be like this 
        /*
            "CollegeName":{
                "BranchName1":"MongodbId Of that chat room",
                "BranchName2":"MongodbId Of that chat room",
                "BranchName3":"MongodbId Of that chat room",
            }


            output-MongodbID of that chat room
        */
        if (!roomSearch) return null;//if data is not present return null as the further error handling can be implemented
        return roomSearch;//retunr the hashset or id of the chatroom and futher operation can be performed on it.
    } catch (error) {
        throw new ApiError(500, error);
    }
}

const cacheUpdateForChatRoom = async (roomName: string, roomID: string) => {//this function is used to update value in chache
    try {

        if (!roomName) throw new ApiError(500, "Invalid room name format");//if it wasn't able to split theme throw erro
        //value are at 0th index
        const roomSearch = await client.hSet(roomName,roomID,roomID);
        //the data will store like this 
        /*
            "roomName":{
                "roomName1":"MongodbId Of that chat room",
                "roomName2":"MongodbId Of that chat room",
                "roomName3":"MongodbId Of that chat room",
            }
        */
        if (!roomSearch) throw new ApiError(500, "Room not found");
        ;//if data is not present return null as the further error handling can be implemented
        return roomSearch;//retunr the hashset or id of the chatroom and futher operation can be performed on it.
    } catch (error) {
        throw new ApiError(500, error);
    }
}

const getVideoServerTransport = async (Id: string) => {//this function helps video server to get transport from cache 
    try {
        const data = await client.hGet("Video", Id);//finds through unique id of video call server
        if (!data) return new ApiResponse(404, "data not found");
        return data;
    } catch (error) {
        throw new ApiError(500, `Something went wrong, while searching data ${error}`)
    }
}

const setVideoServerTransport = async (Id: string, Transport: any) => {//this function helps video server to set transport from cache
    try {
        const data = await client.hSet("Video", Id, Transport);//takes unique id and transport data
        if (!data) return new ApiResponse(404, "data not found");
        return data;
    } catch (error) {
        throw new ApiError(500, `something went Wrong while saving data ${error}`);
    }
}

const removeVideoServerTranspor = async (Id: string) => {//remove video server data after the meeting is ended
    try {
        const data = await client.hDel("Video", Id);
        if (!data) throw new ApiError(404, "data not found");
        return data;
    } catch (error) {
        throw new ApiError(500, `something went wrong while removeing data ${error}`)
    }
}

const closeRedis = async () => {//this function close redis connection
    try {
        client.disconnect();
    } catch (error) {
        throw new ApiError(500, `something went while closeing redis connection`);
    }
}
export {
    cacheSearch,
    cacheUpdate,
    connectReids,
    cacheSearchForChatRoom,
    cacheUpdateForChatRoom,
    getVideoServerTransport,
    setVideoServerTransport,
    removeVideoServerTranspor,
    closeRedis

}