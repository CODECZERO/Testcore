import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { cacheSearchForChatRoom } from "../db/database.redis.query.js";
import jwt from 'jsonwebtoken';


interface Requestany extends Request {
    chatRoomData?: any;
}


const SearchChatRoom = AsyncHandler(async (req: Requestany, res: Response, next: NextFunction) => {
    const roomID = await cacheSearchForChatRoom(req.params.College, req.params.Branch);
    if (!(roomID)) throw new ApiError(404, "chat room not found, make sure it's register");
    const roomName = `${req.params.College}/${req.params.Branch}`;
    req.chatRoomData = { roomID, roomName };
    next();

});

const encryptDecryptData = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req;
        const headertoken = req.get("Authorization"); // Correctly getting the Authorization header
        const token = request.cookies?.accesToken || headertoken?.replace("Bearer ", ""); // Handling cookies and headers
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        // Verify the token here
        const secert: any = process.env.ATS;
        const decoded = await jwt.verify(token, secert) as decodedUser;
        const { email, role } = decoded;
        request.user = decoded; // Assuming `req.user` is where you store the decoded token

        next();
    } catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid secret key"));
    }
})

export {
    SearchChatRoom
};