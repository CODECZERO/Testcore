import { Request, Response, NextFunction } from 'express';
import primsa from "../db/database.Postgres.js";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import bcrypt from "bcrypt";
import { genAccToken, genReffToken } from '../middelware/jwtOp.middelware.js';

const options = {
    httpOnly: true,
    secure: true
}


const tokenGen = async (user: {
    id: string;
    email: string;
    username: string;
    fullname?: string;
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

    const findUser = await primsa.studnet.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            username: true,
            email: true,
            password:true,
            fullname: true,
            phoneNumber: true,
            address: true,
            role: true,
        }
    });

    if (!(findUser||await bcrypt.compare(findUser?.password,password))) throw new ApiError(400, "Invaild password");

    const { refreshToken, accesToken } = await tokenGen(findUser);
    
    await primsa.studnet.upsert({
        where: {
            email
        },
        update: {
            refreshToken
        }
    });

    const {password:_,...userWithOutPassword}=findUser;

    return res.status(200).cookie("refreshToken",refreshToken,options).cookie("accesToken",accesToken,options).json(
        new ApiResponse(200,{user:userWithOutPassword},"Login in successfully")
    )
    
};

//registering user on the site and store data on sql/postgresSql
const singup = async (req: Request, res: Response) => {
    const { username, fullname, email, password, phoneNumber, address, role } = req.body;
    //checking if values are provide or not if not provide throw error 
    if (!(username || email || password || phoneNumber || address || fullname || role)) throw new ApiError(400, "All fields are required");


    const findUser = await primsa.findUnique({//if data is provide then checking if user exist or not in db
        where: {
            username: username,
        },
    });


    if (!findUser) throw new ApiError(406, "User exists");//if it exist throw error

    const hashedPassword = await bcrypt.hash(password, password);

    const userCreate = await primsa.studnet.create({//if it doesn't then create account of user and save data on db
        data: {
            username,
            email,
            password:hashedPassword,
            fullname,
            phoneNumber,
            address,
            role,
            refreshToken: null,

        }
    });

    console.log(userCreate);//loging data remove it 
    
    const userData = await primsa.studnet.findUnique({
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
            role: true,
        },
    });



    if (!userData) throw new ApiError(500, "Something went wrong while registering the user");//if user isn't create then throw error
    return res.status(200).json(//if create then return user data
        new ApiResponse(200, userData, "User create successfuly")
    )
}



const updatePassword = () => {

}


export {
    singup
}