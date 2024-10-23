import jwt from "jsonwebtoken";
import { findOp, getExam } from "../db/Query.sql.db.js";
import { ApiError } from "../util/apiError.js";
import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../util/ayscHandler.js";
import { searchMongodb } from "../db/database.MongoDb.js";
import { nextTick } from "process";
type UserRole = 'Student' | 'College' | 'Examiner'; // Define a type for user roles


interface RequestWithCookies extends Request {
    user?: any;
    examData?: any;
    cookies: { [key: string]: string };

}

interface decodedUser {
    Id: string,
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    address: string,
    role: UserRole

}


const verifyData = AsyncHandler(async (req: RequestWithCookies, res: Response, next: NextFunction) => {
    try {
        const headertoken = req.get("Authorization"); // Correctly getting the Authorization header
        const token = req.cookies?.accesToken || headertoken?.replace("Bearer ", ""); // Handling cookies and headers

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        // Verify the token here
        const secert: any = process.env.ATS;
        const decoded = await jwt.verify(token, secert) as decodedUser;
        const { email, role } = decoded;

        const findUser = await findOp({
            email,
            role,
        });//finding user using email
        if (!findUser) throw new ApiError(400, "Invalid Token");
        req.user = decoded; // Assuming `req.user` is where you store the decoded token

        next();
    } catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid token or role is missing"));
    }
}
)

const verifyexamData = AsyncHandler(async (req: RequestWithCookies, res: Response, next: NextFunction) => {//find exam data
    try {//write user verify logic here
        const token = req.cookies?.ExamToken || req.body;
        if (!token) throw new ApiError(400, "Token not provided");

        const findTokenInMonogoDb = await searchMongodb(token);
        if (!findTokenInMonogoDb) throw new ApiError(404, "Token data not found");

        const findTokenInDb = await getExam(findTokenInMonogoDb?.examID);
        if (!findTokenInDb) throw new ApiError(404, "exam data not found");

        req.examData = findTokenInDb;
        next();

    } catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid token"));
    }
});



export { verifyData, verifyexamData };
