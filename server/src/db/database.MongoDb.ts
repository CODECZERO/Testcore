import mongoose from 'mongoose';
import { examDataStore } from '../models/examDatamanage.model.nosql.js';
interface ExamDocument {
    tokenID: string;
    examID: string;
    // Add other properties that exist in the document
}

const connectDb = async () => {//connects data base and handle error
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
        return connectionInstance;
    } catch (error) {
        console.log(`There is error while connecting to db \n \t ${error} `)
        process.exit(1);
    }
}

const searchMongodb = async (tokenID: string): Promise<ExamDocument | null> => {//search monogdb for exam data
    try {
        const findExam = await examDataStore.findOne<ExamDocument>({ tokenID });
        if (!findExam) return null;
        return findExam;
    } catch (error) {
        console.error("MongoDB search error:", error);
        throw new Error("Error while searching in MongoDB");
    }
};

const closeDb = async (client: typeof mongoose | null) => {//this function close mongodb database connection
    try {
        if (client) {
            await mongoose.disconnect();
            console.log("Disconnected from MongoDB");
        }
    } catch (error) {
        console.log(`something went wrong while closeing mongodb connection ${error}`);
    }
}


export { connectDb, searchMongodb, closeDb };