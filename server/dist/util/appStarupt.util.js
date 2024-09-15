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
import { runWebSocket } from "../services/chat/chatServer.service.js"; //this function make sure that rabbitmq is start
import prisma from "../db/database.Postgres.js";
import { connectDb } from "../db/database.MongoDb.js";
import { connectReids } from "../db/database.redis.query.js";
import { runVideoServer } from "../services/videostream/videoMain.services.js";
const connectAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        yield runWebSocket();
        console.log("Websocket is Runing");
        yield prisma.$connect();
        console.log("Postgres sql is Runing");
        yield connectDb();
        console.log("Mongodb is Runing");
        yield connectReids();
        yield runVideoServer();
        console.log("runing video server");
    }
    catch (error) {
        throw new ApiError(500, `Service is down ${error}`);
    }
});
export default connectAll;
