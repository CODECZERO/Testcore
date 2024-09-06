import { User } from "../models/user.model.nosql.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import { Request,Response,NextFunction } from "express";


interface Requestany extends Request{
    user?:any
}

const Tracker=async (Id:string,req:Requestany)=>{
    const IpAddress:string=String(req.ip);
    const userAgent:string=String(req.headers['user-agent']);

    if(!Id||!IpAddress||!userAgent) throw new ApiError(400,"invalid request");

    const deviceSave=await User.updateOne({
        sqlId:Id,
    },{
        logInDevices:{
            IpAddress,
            userAgent,
        }
    });

    if(!deviceSave) throw new ApiError(404,"user not find");
    return deviceSave
}

export default Tracker;