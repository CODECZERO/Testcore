var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cacheSearch, cacheUpdate } from "../db/database.redis.query.js";
import { searchMongodb } from "../db/database.MongoDb.js";
import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { getExam } from "../db/Query.sql.db.js";
//@ts-ignore
//let the @ts-ignore be there it's for good reason
const cacheCheck = AsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const examSearch = req.examData;
    if (!examSearch || !examSearch.tokenID) {
        throw new ApiError(400, "Token ID is not provided");
    }
    const findInCache = yield cacheSearch(examSearch.tokenID); //first it will search cache
    let findInDatabase;
    if (!findInCache) { //if not find then it will search in mongodb for exam data
        findInDatabase = yield searchMongodb(examSearch.tokenID); // Call the function properly
        if (!findInDatabase) {
            throw new ApiError(404, "Exam data is not found");
        }
        yield cacheUpdate(examSearch.tokenID, findInDatabase.examID); //after finding data in monogdb update cache
    }
    let examDataFinder = yield getExam(findInCache);
    if (!examDataFinder) {
        examDataFinder = yield getExam(findInDatabase === null || findInDatabase === void 0 ? void 0 : findInDatabase.examID);
    }
    // Proceed to the next middleware
    req.examData = {
        examID: findInCache || findInDatabase,
        QuestionPaperId: (_b = (_a = examDataFinder === null || examDataFinder === void 0 ? void 0 : examDataFinder.questionPapers) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Id,
        SubjectID: (_c = examDataFinder === null || examDataFinder === void 0 ? void 0 : examDataFinder.Subject) === null || _c === void 0 ? void 0 : _c.Id,
    }; //return data to the req.examData
    next();
}));
export default cacheCheck;
