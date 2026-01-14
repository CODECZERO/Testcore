import { ApiError } from "../../util/apiError.js";
import jwt from 'jsonwebtoken';
const ChatTokenGen = async (UserChatData) => {
    try {
        if (!UserChatData)
            throw new ApiError(500, "Chat data is not provied");
        const { _id, ChatUsers } = UserChatData; //extract info 
        return await jwt.sign({
            _id,
            ChatUsers
        }, process.env.ChatSecretAccessToken, {
            expiresIn: process.env.ChatSecretExpirToken
        });
    }
    catch (error) {
        throw new ApiError(500, `Something went wrong while making token error:${error}`);
    }
};
const ChatTokenDec = async (token) => {
    try {
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        // Verify the token here
        const secert = process.env.ChatSecretAccessToken;
        const decoded = await jwt.verify(token, secert); //decrypt data 
        //finding user using email email
        return decoded;
    }
    catch (error) {
        throw new ApiError(500, `something went wrong while decodeing token,error:${error}`);
    }
};
export { ChatTokenGen, ChatTokenDec };
