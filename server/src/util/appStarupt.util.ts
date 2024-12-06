//this file created to make sure that during the application start, all other services are ready
//like kafka,rabbitmq,databases,redis,websocket,etc;
//after starting all this services it will start main app;

import { ApiError } from "./apiError.js";
import { closeChatSocket, runWebSocket } from "../services/chat/chatServer.service.js";//this function make sure that rabbitmq is start
import prisma from "../db/database.Postgres.js";
import { closeDb, connectDb } from "../db/database.MongoDb.js";
import { closeRedis, connectReids } from "../db/database.redis.query.js";
import { closeVideoServer, runVideoServer } from "../services/videostream/videoMain.services.js";
import rabbitmq from "../services/rabbitmq/rabbitmq.services.js";

let mongodbConenction: typeof import("mongoose");

const connectAll = async () => {
    try {
        await rabbitmq.connectRabbitMq("StartRoom");
        console.log("queue is connected");
        //@ts-ignore
        await runWebSocket();
        console.log("Websocket is Runing");
        await prisma.$connect();
        console.log("Postgres sql is Runing");
        mongodbConenction = await connectDb();
        console.log("Mongodb is Runing");
        await connectReids();
        console.log("Redis is Runing");
        await runVideoServer();
        console.log("runing video server")

    } catch (error) {
        throw new ApiError(500, `Service is down ${error}`);
    }
}

const closeAll = async () => {//this function close all connection in server;
    try {
        await prisma.$disconnect();
        console.log("postgres sql connection is close");
        await closeDb(mongodbConenction);
        console.log("mongodb connection is close");
        await closeRedis();
        console.log("Redis connection is close");
        await closeChatSocket();
        console.log("chat service is close");
        await closeVideoServer();
        console.log("video service is close");
    } catch (error) {
        throw new ApiError(500, `something went wrong while closeing conenction ${error}`);
    }
}


// this function close all the serverices in server using process in node js
process.on('SIGINT', async () => {
    await closeAll();
    console.log("Disconnected All service");
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeAll();
    console.log("Disconnected All service");
    process.exit(0);
});


export default connectAll;
