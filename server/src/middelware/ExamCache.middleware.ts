import { cacheSearch, cacheUpdate } from "../db/database.redis.query.js";
import { searchMongodb } from "../db/database.MongoDb.js";
import AsyncHandler from "../util/ayscHandler.js";
import { NextFunction } from "express";
import { ApiError } from "../util/apiError.js";
import { getExam } from "../db/Query.sql.db.js";

type examSearch = {
    tokenID: string
}
interface Requestany extends Request {
    examData: any
}

//@ts-ignore
//let the @ts-ignore be there it's for good reason
const cacheCheck = AsyncHandler(async (req: Requestany, res: Response, next: NextFunction) => {//it check's cache for exam data 
    const examSearch: examSearch = req.examData;

    if (!examSearch || !examSearch.tokenID) {
        throw new ApiError(400, "Token ID is not provided");
    }

    const findInCache = await cacheSearch(examSearch.tokenID);//first it will search cache
    let findInDatabase;

    if (!findInCache) {//if not find then it will search in mongodb for exam data
        findInDatabase = await searchMongodb(examSearch.tokenID); // Call the function properly

        if (!findInDatabase) {
            throw new ApiError(404, "Exam data is not found");
        }

        await cacheUpdate(examSearch.tokenID, findInDatabase.examID);//after finding data in monogdb update cache
    }

    let examDataFinder = await getExam(findInCache as string);
    if(!examDataFinder){
        examDataFinder=await getExam(findInDatabase?.examID as string);
    }
    // Proceed to the next middleware

    req.examData = {
        examID: findInCache || findInDatabase,
        QuestionPaperId: examDataFinder?.questionPapers?.[0]?.Id,
        SubjectID: examDataFinder?.Subject?.Id,
    }//return data to the req.examData
    next();
});

export default cacheCheck