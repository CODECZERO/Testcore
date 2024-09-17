import { User } from "../models/user.model.nosql.js";
import { ApiError } from "../util/apiError.js";
import { Request} from "express";


interface Requestany extends Request{
    user?:any
}

const Tracker=async (Id:string,req:Requestany)=>{//take data to log
    const IpAddress:string=String(req.ip);//takes ip address of  device
    const userAgent:string=String(req.headers['user-agent']);// header or user agent

    if(!Id||!IpAddress||!userAgent) throw new ApiError(400,"invalid request");//throw error if not provided

    const deviceSave=await User.updateOne({//update user model info , telling which user has loged in the website
        sqlId:Id,//user id
    },{
        logInDevices:{//saving this data in array or nested object
            IpAddress,
            userAgent,
        }
    });

    if(!deviceSave) throw new ApiError(404,"user not find");
    return deviceSave//return if every thing goes correct
}

export default Tracker;