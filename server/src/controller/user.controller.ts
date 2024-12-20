import { Request, Response } from 'express';
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import bcrypt from "bcrypt";
import { genAccToken, genReffToken } from '../util/jwtOp.util.js';
import { createOp, findCollege, findOp, updateOp, updatePasswordInDB } from '../db/Query.sql.db.js';
import { uploadFile } from '../util/fileUploder.util.js';
import { User } from '../models/user.model.nosql.js';
import AsyncHandler from '../util/ayscHandler.js';
import Tracker from './loginTracker.controller.js';
import { ClassModel } from '../models/class.model.nosql.js';



//all error retunr/out format
// {
//     "statusCode": error status code,
//     "data": "eror message",
//     "success": false,
//     "errors": []
// } 

interface ProfileImageFile {
    path: string;
}

interface Requestany extends Request {
    user?: any
}

interface RequestWithImage extends Requestany {
    customFiles?: {
        ProfileImage?: ProfileImageFile[];
    };
}

type user = {
    Id: string,
    email: string,

}


const options = {//options for cookies to secure theme
    httpOnly: true,
    secure: true
}


const tokenGen = async (user: {
    Id: string;
    email: string;
    name?: string;
    role: string;
    phoneNumber?: string;
    address?: string;
}) => {//creating token
    const [accessToken, refreshToken] = await Promise.all([
        genAccToken(user),//calling genAccToken function to genrate access token for user
        genReffToken(user),//calling genReffToken function to genrate refersh token for server
    ])
    return { accessToken, refreshToken };//returing both of theme
}

//give access to data and other stuff aka login logic
const login = AsyncHandler(async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    if (!(email && password && role)) throw new ApiError(400, "Invaild email id,role or password");

    const findUser = await findOp({ email, role });//finding user using email
    if (!findUser) throw new ApiError(400, "Invaild User");//checking if user passwrod is valid or not
    const passwordCheck = await bcrypt.compare(password, findUser.password);

    if (!passwordCheck) throw new ApiError(400, "Invalid password")

    const findAndRole = { ...findUser, role }

    const [tokenResult, trackerUpdate] = await Promise.all([
        tokenGen(findAndRole),
        Tracker(findUser.Id, req)//save's user ip adrress in database  ;
    ]);

    const { refreshToken, accessToken } = tokenResult //genereating token for the user

    const data = {//passing refersh token to the database
        ...findUser,
        refreshToken
    }

    await updateOp(data, role);//pass the role to user it's necessary
    const { password: _, ...userData } = findUser;//removing user password form find user

    return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accesToken", accessToken, options).json(
        new ApiResponse(200, { userData, trackerUpdate, accessToken }, "Login in successfully")
    )

});

//registering user on the site and store data on sql/postgresSql
//
const signup = AsyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, phoneNumber, address, role } = req.body;
    //checking if values are provide or not if not provide throw error 
    if (!(email && password && phoneNumber && address && name && role)) throw new ApiError(400, "All fields are required");


    const findUser = await findOp({ email, role });//passing req.body value to query function
    if (findUser) return res.status(409).json(new ApiError(409, "user exists"));
    //if it exist throw error in this formate
    // {
    //     "statusCode": 409,
    //     "data": "user exists",
    //     "success": false,
    //     "errors": []
    // } 
    const findAndRole = { ...findUser, role };
    const tokenResult=await tokenGen(findAndRole);
    const hashedPassword=await bcrypt.hash(password,10);

    if(!(tokenResult&&hashedPassword)) throw new ApiError(400,"something went wrong while hashing password");
    const { refreshToken, accessToken } = tokenResult;//genereating token for the user
    const UserSingupData = { ...req.body, refreshToken };
    const userCreate = await createOp(UserSingupData, hashedPassword);//passing req.body value to query function with hashed password
    const userData = { userCreate, password: "" };//replacing the password with empty string

    const saveUserInNosql = await User.create({
        sqlId: userCreate.Id,
    })
    if (!userData || !saveUserInNosql) throw new ApiError(500, "Something went wrong while registering the user");//if user isn't create then throw error
    return res.status(201).cookie('accessToken', accessToken, options).json(//if create then return user data
        new ApiResponse(201, { userData, accessToken }, "User create successfuly")
    )
})

//
//
const updatePassword = AsyncHandler(async (req: Requestany, res: Response) => {
    //updates password of user based on the roles

    const { email, role } = req.user;//taking email,role,passwrod from user
    const { password } = req.body;
    if (!(password && role && email)) return res.status(400).json("password is not provided");//if not found then return error
    const hashedPassword = await bcrypt.hash(password, 10);//hash password
    const update = await updatePasswordInDB(req.user, hashedPassword);//chage hash password in db
    if (!update) {
        throw new ApiError(500, "error while updating password");
    };//if update is fail then error
    //else return output
    return res.status(200).json(new ApiResponse(200, "password update successfuly"));
})

//
const updateProfileImage = AsyncHandler(async (req: RequestWithImage, res: Response) => {//update profile image of user based on the role
    const fileURI = req.customFiles?.ProfileImage?.[0]?.path;
    const userData: user = req.user || {};

    if (!fileURI) return res.status(400).json(new ApiError(400, "please provide images"));

    const upload = await uploadFile(fileURI);//upload file on the cloud server

    if (!(upload && userData.email)) return res.status(500).json(new ApiError(500, "error while uploading file on server"));

    const user = await User.findOneAndUpdate(//finding user on mongodb if it'exists with that email id then chage photo
        { email: userData.email },
        {
            $set: {
                sqlId: userData?.Id,
                profile: upload,
            },
        },
        { new: true, projection: { profile: true, _id: false } });

    let updateProfile = null;

    if (!(user)) {//if user does not exist then create it
        updateProfile = await User.create({
            sqlId: userData?.Id,
            profile: upload
        })
    }//if there is any issues while updating data on monogodb
    //then return error

    return res.status(200).json(new ApiResponse(200, updateProfile || user?.profile, "user profile image updated successfuly"));//else return success messsage

});
//
const getCollege = AsyncHandler(async (req: Request, res: Response) => {//findings college for student 
    const findCollegeName = await findCollege();//find college name 
    if (!findCollegeName) return res.status(400).json(new ApiError(400, "No college is register"));//throws error if it doesn't exists
    return res.status(200).json(new ApiResponse(200, findCollegeName));//returns college name
}
)

const SessionActive = AsyncHandler(async (req: Requestany, res: Response) => {//this function is to make check login session
    const refreshToken = req.user;//takes token from frontend
    const role = req.user.role;
    if (!refreshToken || !role) throw new ApiError(401, "user is not auth");//if user doesn't have token then throw error
    const verify = await findOp({ role, email: refreshToken.email });// find user in database
    if (!verify) throw new ApiError(401, "user is not auth");//if user is not verify
    return res.status(200).json(new ApiResponse(200, verify, "user is auth"));//return res and verfiy data
})

const getClass = AsyncHandler(async (req: Request, res: Response) => {//get class for users and it's only use for time table use case 
    //it may be used futher
    const UserClass = await ClassModel.find({}).select('name _id');//taking name and id from the schema
    if (!UserClass) throw new ApiError(404, "Class not fount");
    return res.status(200).json(new ApiResponse(200, UserClass, "user class"));
});

const createClass = AsyncHandler(async (req: Request, res: Response) => {//creates class for user 
    const { Classname } = req.body;//taking class name from user, takes class name from user and make class using it
    if (!Classname) throw new ApiError(400, "class name is not provided");
    const createClassForuser = await ClassModel.create({
        name: Classname//create class
    })

    if (!createClassForuser) throw new ApiError(406, "unable to create class or class existe");

    return res.status(200).json(new ApiResponse(200, createClassForuser, "class created successfuly"));//return if successfuly
})


const getProfileImage = AsyncHandler(async (req: Requestany, res: Response) => {
    const userData: user = req.user;

    if (!(userData.email || userData.Id)) throw new ApiError(401, "unauthorized action");

    const user = await User.findOne(
        {
            email: userData.email
        },
        {
            profile: true,
            _id: false
        });

    if (!user) throw new ApiError(404, "user profile not found");
    return res.status(400).json(new ApiResponse(200, user, "found user Profile Image"));
});

export {
    signup,
    login,
    updatePassword,
    updateProfileImage,
    getCollege,
    tokenGen,
    SessionActive,
    options,
    getClass,
    createClass,
    getProfileImage
}