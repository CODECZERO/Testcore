var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accesToken) || (headertoken === null || headertoken === void 0 ? void 0 : headertoken.replace("Bearer ", "")) || req.body.token; // Handling cookies and headers
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
    var _b, _c;
    //this function is used for finding data realted exam
    try { //write user verify logic here
        const token = ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.ExamToken) || req.body;
        const userTkone = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c.accesToken;
        if (!token || !userTkone)
            throw new ApiError(400, "Token not provided");
        // Verify the token here
        const secert = process.env.ATS;
        const decoded = yield jwt.verify(token, secert);
        const { email, role } = decoded;
        const findTokenInMonogoDb = yield searchMongodb(token); //find exam id in the mongodb token
        //as token is 7 or 8 length string
        //and sql id is 32 byte size string , it's for user, as it makes easy to write and rember
        const findUser = yield findOp({
            email,
            role
        });
        //as the userid is require in some cases to find some things 
        //such as result and so other things
        if (!findTokenInMonogoDb || !findUser)
            throw new ApiError(404, "Token data not found");
        const findTokenInDb = yield getExam(findTokenInMonogoDb === null || findTokenInMonogoDb === void 0 ? void 0 : findTokenInMonogoDb.examID);
        if (!findTokenInDb)
            throw new ApiError(404, "exam data not found");
        const { password: _ } = findUser, userData = __rest(findUser, ["password"]);
        req.examData = { findTokenInDb, userData }; //returning two different object in two different way , as it can be accessed according to use not all at a time
        //as it makes hard to understand but it's may be good 
        next();
    }
    catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid token"));
    }
}));
export { verifyData, verifyexamData };
