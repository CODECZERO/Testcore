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
import { ApiError } from "../util/apiError.js";
const genAccToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, email, name, role, phoneNumber, address } = user;
        const secreat = process.env.ATS;
        if (!(secreat || user)) {
            throw new ApiError(500, "secreat is missing or user info");
        }
        return jwt.sign({
            id,
            email,
            name,
            role,
            phoneNumber,
            address
        }, secreat, //Access token secreat 
        {
            expiresIn: process.env.ATE //access token expriery
        });
    }
    catch (error) {
        throw new ApiError(500, "unable to genrate token");
    }
});
const genReffToken = (//creates refersh token
user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = user;
        const secreat = process.env.RTS;
        return jwt.sign({
            id
        }, secreat, {
            expiresIn: process.env.RTE
        });
    }
    catch (error) {
        throw new ApiError(400, "unable to generate refersh token");
    }
});
export { genAccToken, genReffToken };
