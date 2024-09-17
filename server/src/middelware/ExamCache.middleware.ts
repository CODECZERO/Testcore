import { cacheSearch,cacheUpdate } from "../db/database.redis.query";
import { searchMongodb } from "../db/database.MongoDb";
import AsyncHandler from "../util/ayscHandler";
import { NextFunction } from "express";
import { ApiError } from "../util/apiError";

type examSearch={
    tokenID:string
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

    // Proceed to the next middleware
    req.examData = findInCache || findInDatabase;//return data to the req.examData
    next();
});

export default cacheCheck