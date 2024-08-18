var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import { examDataStore } from '../models/examDatamanage.model.nosql.js';
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connectionInstance = yield mongoose.connect(`${process.env.MONGODB_URL}`);
        return "connected";
    }
    catch (error) {
        console.log(`There is error while connecting to db \n \t ${error} `);
        process.exit(1);
    }
});
const searchMongodb = (tokenID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findExam = yield examDataStore.findOne({
            tokenID
        });
        if (!findExam)
            return null;
        return findExam;
    }
    catch (error) {
        return error;
    }
});
export { connectDb, searchMongodb };
