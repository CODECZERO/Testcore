import mongoose from 'mongoose';
import { examDataStore } from '../models/examDatamanage.model.nosql.js';
const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
        return connectionInstance;
    }
    catch (error) {
        console.log(`There is error while connecting to db \n \t ${error} `);
        process.exit(1);
    }
};
const searchMongodb = async (tokenID) => {
    try {
        const findExam = await examDataStore.findOne({ tokenID });
        if (!findExam)
            return null;
        return findExam;
    }
    catch (error) {
        console.error("MongoDB search error:", error);
        throw new Error("Error while searching in MongoDB");
    }
};
const closeDb = async (client) => {
    try {
        if (client) {
            await mongoose.disconnect();
            console.log("Disconnected from MongoDB");
        }
    }
    catch (error) {
        console.log(`something went wrong while closeing mongodb connection ${error}`);
    }
};
export { connectDb, searchMongodb, closeDb };
