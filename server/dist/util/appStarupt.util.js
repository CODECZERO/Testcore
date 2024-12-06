//this file created to make sure that during the application start, all other services are ready
//like kafka,rabbitmq,databases,redis,websocket,etc;
//after starting all this services it will start main app;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiError } from "./apiError.js";
import { closeChatSocket, runWebSocket } from "../services/chat/chatServer.service.js"; //this function make sure that rabbitmq is start
import prisma from "../db/database.Postgres.js";
import { closeDb, connectDb } from "../db/database.MongoDb.js";
import { closeRedis, connectReids } from "../db/database.redis.query.js";
import { closeVideoServer, runVideoServer } from "../services/videostream/videoMain.services.js";
import rabbitmq from "../services/rabbitmq/rabbitmq.services.js";
let mongodbConenction;
const connectAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rabbitmq.connectRabbitMq("StartRoom");
        console.log("queue is connected");
        //@ts-ignore
        yield runWebSocket();
        console.log("Websocket is Runing");
        yield prisma.$connect();
        console.log("Postgres sql is Runing");
        mongodbConenction = yield connectDb();
        console.log("Mongodb is Runing");
        yield connectReids();
        console.log("Redis is Runing");
        yield runVideoServer();
        console.log("runing video server");
    }
    catch (error) {
        throw new ApiError(500, `Service is down ${error}`);
    }
});
const closeAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$disconnect();
        console.log("postgres sql connection is close");
        yield closeDb(mongodbConenction);
        console.log("mongodb connection is close");
        yield closeRedis();
        console.log("Redis connection is close");
        yield closeChatSocket();
        console.log("chat service is close");
        yield closeVideoServer();
        console.log("video service is close");
    }
    catch (error) {
        throw new ApiError(500, `something went wrong while closeing conenction ${error}`);
    }
});
// this function close all the serverices in server using process in node js
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield closeAll();
    console.log("Disconnected All service");
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield closeAll();
    console.log("Disconnected All service");
    process.exit(0);
}));
export default connectAll;
