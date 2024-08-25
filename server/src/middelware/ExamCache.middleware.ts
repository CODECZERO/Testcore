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
const cacheCheck = AsyncHandler(async (req: Requestany, res: Response, next: NextFunction) => {
    const examSearch: examSearch = req.examData;
    
    if (!examSearch || !examSearch.tokenID) {
        throw new ApiError(400, "Token ID is not provided");
    }

    const findInCache = await cacheSearch(examSearch.tokenID);
    let findInDatabase;

    if (!findInCache) {
        findInDatabase = await searchMongodb(examSearch.tokenID); // Call the function properly
        
        if (!findInDatabase) {
            throw new ApiError(404, "Exam data is not found");
        }

        await cacheUpdate(examSearch.tokenID, findInDatabase.examID);
    }

    // Proceed to the next middleware
    req.examData = findInCache || findInDatabase;
    next();
});

export default cacheCheck