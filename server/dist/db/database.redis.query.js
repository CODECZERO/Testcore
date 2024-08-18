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
        return error;
    }
});
const cacheUpdate = (tokenID, examID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield client.set(tokenID, examID);
        if (!data)
            return null;
        return data;
    }
    catch (error) {
        return error;
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
        return error;
    }
});
export { cacheSearch, cacheUpdate, connectReids };
