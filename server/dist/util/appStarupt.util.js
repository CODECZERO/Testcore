//this file created to make sure that during the application start, all other services are ready
//like kafka,rabbitmq,databases,redis,websocket,etc;
//after starting all this services it will start main app;
import { ApiError } from "./apiError.js";
import { closeChatSocket, runWebSocket } from "../services/chat/chatServer.service.js"; //this function make sure that rabbitmq is start
import prisma from "../db/database.Postgres.js";
import { closeDb, connectDb } from "../db/database.MongoDb.js";
import { closeRedis, connectReids } from "../db/database.redis.query.js";
import { closeVideoServer, runVideoServer } from "../services/videostream/videoMain.services.js";
import rabbitmq from "../services/rabbitmq/rabbitmq.services.js";
let mongodbConenction;
const connectAll = async () => {
    try {
        await rabbitmq.connectRabbitMq("StartRoom");
        console.log("queue is connected");
        //@ts-ignore
        await runWebSocket();
        console.log("Websocket is Runing");
        // Try to connect to Postgres - continue even if it fails
        try {
            await prisma.$connect();
            console.log("Postgres sql is Runing");
        }
        catch (pgError) {
            console.error(`Database connection fail ${pgError}`);
        }
        // Try to connect to MongoDB - continue even if it fails
        try {
            mongodbConenction = await connectDb();
            console.log("Mongodb is Runing");
        }
        catch (mongoError) {
            console.error(`MongoDB connection fail ${mongoError}`);
        }
        // Try to connect to Redis - continue even if it fails
        try {
            await connectReids();
            console.log("Redis is Runing");
        }
        catch (redisError) {
            console.error(`Redis connection fail ${redisError}`);
        }
        await runVideoServer();
        console.log("runing video server");
    }
    catch (error) {
        throw new ApiError(500, `Service is down ${error}`);
    }
};
const closeAll = async () => {
    // Close Postgres
    try {
        await prisma.$disconnect();
        console.log("postgres sql connection is close");
    }
    catch (error) {
        console.error(`Error closing Postgres: ${error}`);
    }
    // Close MongoDB
    try {
        await closeDb(mongodbConenction);
        console.log("mongodb connection is close");
    }
    catch (error) {
        console.error(`Error closing MongoDB: ${error}`);
    }
    // Close Redis
    try {
        await closeRedis();
        console.log("Redis connection is close");
    }
    catch (error) {
        console.error(`Error closing Redis: ${error}`);
    }
    // Close Chat Socket
    try {
        await closeChatSocket();
        console.log("chat service is close");
    }
    catch (error) {
        console.error(`Error closing chat socket: ${error}`);
    }
    // Close Video Server
    try {
        await closeVideoServer();
        console.log("video service is close");
    }
    catch (error) {
        console.error(`Error closing video server: ${error}`);
    }
};
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
