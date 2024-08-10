import jwt from "jsonwebtoken";
import { findOp } from "../db/Query.db.js";
import { ApiError } from "../util/apiError.js";
import { Request, Response, NextFunction } from "express";

type UserRole = 'Student' | 'College' | 'Examiner'; // Define a type for user roles


interface RequestWithCookies extends Request {
    user?: any;
    cookies: { [key: string]: string };
}

interface decodedUser {
    Id: string,
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    address: string,
    role:UserRole
    
}


const verifyData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as RequestWithCookies;
        const headertoken = req.get("Authorization"); // Correctly getting the Authorization header
        const token =request.cookies?.accesToken || headertoken?.replace("Bearer ", ""); // Handling cookies and headers
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        // Verify the token here
        const secert: any = process.env.ATS;
        const decoded = await jwt.verify(token, secert) as decodedUser;
        const {email,role} = decoded;
        console.log(email,role,decoded);
        const findUser = await findOp({
            email,
            role,
            name: '',
            phoneNumber: '',
            address: '',
            refreshToken: ''
        });//finding user using email
        request.user = decoded; // Assuming `req.user` is where you store the decoded token

        next();
    } catch (error) {
        next(new ApiError(401, "Unauthorized: Invalid token or role is missing"));
    }
};

export { verifyData };
