var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { findOp, getExam } from "../db/Query.sql.db.js";
import { ApiError } from "../util/apiError.js";
import AsyncHandler from "../util/ayscHandler.js";
import { searchMongodb } from "../db/database.MongoDb.js";
const verifyData = AsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const headertoken = req.get("Authorization"); // Correctly getting the Authorization header
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accesToken) || (headertoken === null || headertoken === void 0 ? void 0 : headertoken.replace("Bearer ", "")); // Handling cookies and headers
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        // Verify the token here
        const secert = process.env.ATS;
        const decoded = yield jwt.verify(token, secert);
        const { email, role } = decoded;
        const findUser = yield findOp({
            email,
            role,
        }); //finding user using email
        if (!findUser)
            throw new ApiError(400, "Invalid Token");
        req.user = decoded; // Assuming `req.user` is where you store the decoded token
        next();
    }
    catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid token or role is missing"));
    }
}));
const verifyexamData = AsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try { //write user verify logic here
        const token = ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.ExamToken) || req.body;
        if (!token)
            throw new ApiError(400, "Token not provided");
        const findTokenInMonogoDb = yield searchMongodb(token);
        if (!findTokenInMonogoDb)
            throw new ApiError(404, "Token data not found");
        const findTokenInDb = yield getExam(findTokenInMonogoDb === null || findTokenInMonogoDb === void 0 ? void 0 : findTokenInMonogoDb.examID);
        if (!findTokenInDb)
            throw new ApiError(404, "exam data not found");
        req.examData = findTokenInDb;
        next();
    }
    catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid token"));
    }
}));
export { verifyData, verifyexamData };
