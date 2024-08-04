import jwt from "jsonwebtoken";
import { ApiError } from "../util/apiError";

const genAccToken = async (user: {//create access token so user don't have to login in again wihtin specfied time limit
    id: string;
    email: string;
    username: string;
    fullname?: string;
    role: string;
    phoneNumber?: string;
    address?: string;
}) => {
    try {
        const {id,email,username,fullname,role,phoneNumber,address}=user;
        const secreat:any=process.env.ATS;
        if(!(secreat||user)){
            throw new ApiError(500,"secreat is missing or user info")
        }
        return jwt.sign({
            id,
            email,
            username,
            fullname,
            role,
            phoneNumber,
            address

        }, 
       secreat,//Access token secreat 
            {
                expiresIn: process.env.ATE//access token expriery
            });
    } catch (error) {
        throw new ApiError(500, "unable to genrate token");
    }
}

const genReffToken=async(//creates refersh token
    user:{
        id:string//takes user id as argument
    }
)=>{
    try {
        const {id}=user;
        const secreat:any=process.env.RTS;
        return jwt.sign({
            id
        },secreat,{
            expiresIn:process.env.RTE
        });
    } catch (error) {
        throw new ApiError(400,"unable to generate refersh token");
    }
}

export {genAccToken,genReffToken};