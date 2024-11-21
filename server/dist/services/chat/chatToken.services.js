var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiError } from "../../util/apiError.js";
import jwt from 'jsonwebtoken';
const ChatTokenGen = (UserChatData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!UserChatData)
            throw new ApiError(500, "Chat data is not provied");
        const { _id, ChatUsers } = UserChatData; //extract info 
        return yield jwt.sign({
            _id,
            ChatUsers
        }, process.env.ChatSecretAccessToken, {
            expiresIn: process.env.ChatSecretExpirToken
        });
    }
    catch (error) {
        throw new ApiError(500, `Something went wrong while making token error:${error}`);
    }
});
const ChatTokenDec = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        // Verify the token here
        const secert = process.env.ChatSecretAccessToken;
        const decoded = yield jwt.verify(token, secert); //decrypt data 
        //finding user using email email
        return decoded;
    }
    catch (error) {
        throw new ApiError(500, `something went wrong while decodeing token,error:${error}`);
    }
});
export { ChatTokenGen, ChatTokenDec };
