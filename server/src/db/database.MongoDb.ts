import mongoose from 'mongoose';
import { examDataStore } from '../models/examDatamanage.model.nosql.js';
const connectDb=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}`);
        return "connected";
    } catch (error) {
        console.log(`There is error while connecting to db \n \t ${error} `)
        process.exit(1);
    }
}

const searchMongodb=async(tokenID:string)=>{
        try {
            const findExam=await examDataStore.findOne({
                tokenID
            });
            if(!findExam)return null;
            return findExam;
        } catch (error) {
            return error
        }

}
export {connectDb,searchMongodb};