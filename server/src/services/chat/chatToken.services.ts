import { ApiError } from "../../util/apiError.js";
import { Request } from "express";
import jwt from 'jsonwebtoken';

interface ChatUser {
    _id: string;
    name: string;
    members: string[];
    createdAt: string;
}

type UserChatData = {
    _id: string;
    ChatUsers: ChatUser[];
}

interface RequestWithCookies extends Request {
    user?: any;
    cookies: { [key: string]: string };
}


const ChatTokenGen = async (UserChatData: UserChatData) => {
    try {
        if (!UserChatData) throw new ApiError(500, "Chat data is not provied");
        const { _id, ChatUsers } = UserChatData;
        return await jwt.sign({
            _id,
            ChatUsers
        }, process.env.ChatSecretAccessToken as string,
            {
                expiresIn: process.env.ChatSecretExpirToken
            });
    } catch (error) {
        throw new ApiError(500, `Something went wrong while making token error:${error}`);
    }
}

const ChatTokenDec = async (token:string) => {
    try {
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        // Verify the token here
        const secert: any = process.env.ChatSecretAccessToken;

        const decoded = await jwt.verify(token, secert) as UserChatData;

        //finding user using email email
        return decoded

    } catch (error) {
        throw new ApiError(500,`something went wrong while decodeing token,error:${error}`);
    }
}
export {
    ChatTokenGen,
    ChatTokenDec
}