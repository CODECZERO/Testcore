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
import { findOp } from "../db/Query.sql.db.js";
import { ApiError } from "../util/apiError.js";
import AsyncHandler from "../util/ayscHandler.js";
const verifyData = AsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const request = req;
        const headertoken = req.get("Authorization"); // Correctly getting the Authorization header
        const token = ((_a = request.cookies) === null || _a === void 0 ? void 0 : _a.accesToken) || (headertoken === null || headertoken === void 0 ? void 0 : headertoken.replace("Bearer ", "")); // Handling cookies and headers
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
            name: '',
            phoneNumber: '',
            address: '',
            refreshToken: ''
        }); //finding user using email
        request.user = decoded; // Assuming `req.user` is where you store the decoded token
        next();
    }
    catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid token or role is missing"));
    }
}));
const examData = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
export { verifyData };
