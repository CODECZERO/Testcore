import { config } from "dotenv";
config();
import { connectDb } from "./db/database.MongoDb.js";
import app from "./app.js";
connectDb().then(() => {
    app.listen(process.env.PORT || 8080, () => { console.log(`App running on port:${process.env.PORT}`) });
   
}).catch((error) => {
    console.log(`Database connection fail ${error}`);
})





