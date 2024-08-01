import { Request, Response, NextFunction } from 'express';
import primsa from "../db/database.Postgres.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import AsyncHandler from "../util/ayscHandler.js";
import bcrypt from "bcrypt";

const options = {
    httpOnly: true,
    secure: true
}


const passwordValid=async()=>{

}

const login = AsyncHandler(async (req,res,_) => {
    const {}=req.body;
    
    if(!passwordValid) throw new ApiError(400,"Invaild password");
});

//registering user on the site and store data on sql/postgresSql
const singup = async (req:Request,res:Response) => {
    const {username,fullname,email,password,phoneNumber,address}=req.body;
    //checking if values are provide or not if not provide throw error 
    if(!(username&email&password&phoneNumber&address&fullname))throw new ApiError(400,"All fields are required");
    

    const findUser=await primsa.findUnique({//if data is provide then checking if user exist or not in db
        where:{
            username:username,
        },
    });


    if(!findUser)throw new ApiError(400,"User exists");//if it exist throw error
    const UniHash:string|any=process.env.UNIHASH;
    const hashedPassword = await bcrypt.hash(password,UniHash);
    
    const userCreate=await primsa.User.create({//if it doesn't then create account of user and save data on db
        data:{
            username,
            email,
            password,
            fullname,
            phoneNumber:hashedPassword,
            address,

        }
    });

    const userData = await primsa.user.findUnique({
        where: {
          id: userCreate.id,
        },
        select: {
          id: true,
          username: true,
          email: true,
          fullname: true,
          phoneNumber: true,
          address: true,
        },
      });

    if(!userData)throw new ApiError(500,"Something went wrong while registering the user");//if user isn't create then throw error
    return res.status(200).json(//if create then return user data
        new ApiResponse(200,userData,"User create successfuly")
    )
}



const updatePassword = () => {

}


export {
    singup
}