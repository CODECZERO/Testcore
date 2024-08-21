import { createClient } from "redis";
import { ApiError } from "../util/apiError";
import { RedisClientType } from "@redis/client";


const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

let client: RedisClientType;
const connectReids = async () => {
    try {
       client = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        console.log('Redis connected successfully');

        // You can now use the Redis client
    } catch (error) {
        return error;
    }
}

const cacheUpdate = async (tokenID: string, examID: string) => {
    try {
        const data = await client.setEx(tokenID,86400,examID);
        if (!data) return null;
        return data
    } catch (error) {
        return error
    }
}

const cacheSearch = async (tokenID: String) => {
    try {
        const dataSearch = await client.get(`${tokenID}`);
        if (!dataSearch) return null;
        return dataSearch
    } catch (error) {
        return error
    }
}

export {
    cacheSearch,
    cacheUpdate,
    connectReids
}