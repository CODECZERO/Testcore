import { config } from "dotenv";
config();
import { connectDb } from "./db/database.MongoDb.js";
import app from "./app.js";
import { connectReids } from "./db/database.redis.query.js";
import runWebSocket from "./services/chat/chatServer.service.js";
connectDb().then(() => {
    app.listen(process.env.PORT || 8080, () => { console.log(`App running on port:${process.env.PORT}`) });
    runWebSocket();
    console.log("Websokcet server runing")
}).catch((error) => {
    console.log(`Database connection fail ${error}`);
})





