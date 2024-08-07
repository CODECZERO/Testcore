import { Request, Response, NextFunction } from 'express';
import prisma from "../db/database.Postgres.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import bcrypt from "bcrypt";
import { genAccToken, genReffToken } from '../middelware/jwtOp.middelware.js';
import { createOp, findOp, updateOp } from './userQuery.controller.js';

const options = {
    httpOnly: true,
    secure: true
}


const tokenGen = async (user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    phoneNumber?: string;
    address?: string;
}) => {//creating token
    const accesToken = genAccToken(user);
    const refreshToken = genReffToken(user);

    return { accesToken, refreshToken };
}

const login = async (req:Request,res:Response) => {
    const { email, password } = req.body;
    if (!(email || password)) throw new ApiError(400, "Invaild email id or password");

    const findUser = await findOp({...email});//finding user using email

    if (!(findUser||await bcrypt.compare(findUser?.password,password))) throw new ApiError(400, "Invaild password");//checking if user passwrod is valid or not

    const { refreshToken, accesToken } = await tokenGen(findUser);//genereating token for the user
    const data={//passing refersh token to the database
        ...findUser,
        refreshToken
    }
    await updateOp(data);
    

    const {password:_,...userWithOutPassword}=findUser;//removing user password form find user

    return res.status(200).cookie("refreshToken",refreshToken,options).cookie("accesToken",accesToken,options).json(
        new ApiResponse(200,{user:userWithOutPassword},"Login in successfully")
    )
    
};

//registering user on the site and store data on sql/postgresSql
const signup = async (req: Request, res: Response) => {
    const { name, email, password, phoneNumber, address, role } = req.body;
    //checking if values are provide or not if not provide throw error 
    if (!(email || password || phoneNumber || address || name || role)) throw new ApiError(400, "All fields are required");


    const findUser =await findOp(req.body);//passing req.body value to query function
    if (findUser) return res.status(409).json("user Exist");//if it exist throw error

    const hashedPassword = await bcrypt.hash(password, 10);//hashing the password
    const userCreate=await createOp(req.body,hashedPassword);//passing req.body value to query function with hashed password
    const userData={...userCreate,password:""};//replacing the password with empty string


    if (!userData) throw new ApiError(500, "Something went wrong while registering the user");//if user isn't create then throw error
    return res.status(200).json(//if create then return user data
        new ApiResponse(200, userData, "User create successfuly")
    )
}



const updatePassword = () => {

}


export {
    signup,
    login
}