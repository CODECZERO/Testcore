//this file created to make sure that during the application start, all other services are ready
//like kafka,rabbitmq,databases,redis,websocket,etc;
//after starting all this services it will start main app;

import { ApiError } from "./apiError.js";
import { runWebSocket } from "../services/chat/chatServer.service.js";//this function make sure that rabbitmq is start
import prisma from "../db/database.Postgres.js";
import { connectDb } from "../db/database.MongoDb.js";
import { connectReids } from "../db/database.redis.query.js";


const connectAll = async () => {
    try {
        //@ts-ignore
        await runWebSocket();
        console.log("Websocket is Runing");
        await prisma.$connect();
        console.log("Postgres sql is Runing");
        await connectDb();
        console.log("Mongodb is Runing");
        await connectReids();

    } catch (error) {
        throw new ApiError(500,`Service is down ${error}`);
    }
}

export default connectAll;
