import { Request, Response} from 'express';
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import bcrypt from "bcrypt";
import { genAccToken, genReffToken } from '../util/jwtOp.util.js';
import { createOp, findCollege, findOp, updateOp, updatePasswordInDB } from '../db/Query.sql.db.js';
import { uploadFile } from '../util/fileUploder.util.js';
import { User } from '../models/user.model.nosql.js';
import AsyncHandler from '../util/ayscHandler.js';


//all error retunr/out format
// {
//     "statusCode": error status code,
//     "data": "eror message",
//     "success": false,
//     "errors": []
// } 

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
    const accesToken =await genAccToken(user);//calling genAccToken function to genrate access token for user
    const refreshToken = await genReffToken(user);//calling genReffToken function to genrate refersh token for server
    return { accesToken, refreshToken };//returing both of theme
}
//
const login = AsyncHandler(async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    if (!(email || password || role)) throw new ApiError(400, "Invaild email id,role or password");
    
    const findUser = await findOp({email,role});//finding user using email
    
    if (!findUser) throw new ApiError(400, "Invaild User");//checking if user passwrod is valid or not
    
    const passwordCheck=await bcrypt.compare(password,findUser.password);
    
    if(!passwordCheck)throw new ApiError(400,"Invalid password")
    const findAndRole={...findUser,role}
    const { refreshToken, accesToken } = await tokenGen(findAndRole);//genereating token for the user
    const data = {//passing refersh token to the database
        ...findUser,
        refreshToken
    }
    await updateOp(data,role);//pass the role to user it's necessary

    const { password: _, ...userWithOutPassword } = findUser;//removing user password form find user

    return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accesToken", accesToken, options).json(
        new ApiResponse(200, userWithOutPassword, "Login in successfully")
    )

});

//registering user on the site and store data on sql/postgresSql
//
const signup = AsyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, phoneNumber, address, role } = req.body;
    //checking if values are provide or not if not provide throw error 
    if (!(email || password || phoneNumber || address || name || role)) throw new ApiError(400, "All fields are required");


    const findUser = await findOp(req.body);//passing req.body value to query function
    if (findUser) return res.status(409).json(new ApiError(409, "user exists"));
    //if it exist throw error in this formate
    // {
    //     "statusCode": 409,
    //     "data": "user exists",
    //     "success": false,
    //     "errors": []
    // } 
    const hashedPassword = await bcrypt.hash(password, 10);//hashing the password
    const userCreate = await createOp(req.body, hashedPassword);//passing req.body value to query function with hashed password
    const userData = { userCreate, password: "" };//replacing the password with empty string


    if (!userData) throw new ApiError(500, "Something went wrong while registering the user");//if user isn't create then throw error
    return res.status(201).json(//if create then return user data
        new ApiResponse(201, userData, "User create successfuly")
    )
}
)

//
interface Requestany extends Request{
    user?:any
}
//
const updatePassword = AsyncHandler(async (req: Requestany, res: Response) => {
    //updates password of user based on the roles

    const { email, role} = req.user;//taking email,role,passwrod from user
    const {password}=req.body;
    if (!(password || role || email)) return res.status(400).json("password is not provided");//if not found then return error
    const hashedPassword = await bcrypt.hash(password, 10);//hash password
    const update = await updatePasswordInDB(req.user, hashedPassword);//chage hash password in db
    if (!update) {
        throw new ApiError(500, "error while updating password");
    };//if update is fail then error
    //else return output
    return res.status(200).json(new ApiResponse(200,"password update successfuly"));
})

//
const updateProfileImage = AsyncHandler(async (req: Request, res: Response) => {//update profile image of user based on the role
    const fileURI = req.file?.path;
    const { role, refreshToken } = req.body;
    const findUser = await findOp({
        email: "",
        refreshToken,
        role,
        name: '',
        phoneNumber: '',
        address: '',
    });//finding user using email
    if (!fileURI) return res.status(400).json(new ApiError(400, "please provide images"));
    const upload = await uploadFile(fileURI);//upload file on the cloud server
    if (!(upload || findUser.email)) return res.status(500).json(new ApiError(500, "error while uploading file on server"));
    const user = await User.findOneAndUpdate(//finding user on mongodb if it'exists with that email id then chage photo
        findUser.email, {
        $set: {
            sqlId: findUser?.id,
            profile: upload,
        }
    }
    )
    let updateProfile=null;
    if (!user){//if user does not exist then create it
            updateProfile=await User.create({
                sqlId:findUser?.Id,
                profile:upload
            })
    }//if there is any issues while updating data on monogodb
    //then return error
    return res.status(200).json(new ApiResponse(200, updateProfile||user,"user profile image updated successfuly"));//else return success messsage

})
//
const getCollege = AsyncHandler(async (req: Request, res: Response) => {//findings college for student 
    const findCollegeName = await findCollege();//find college name 
    if (!findCollegeName) return res.status(400).json(new ApiError(400, "No college is register"));//throws error if it doesn't exists
    return res.status(200).json(new ApiResponse(200, findCollegeName));//returns college name
}
)

export {
    signup,
    login,
    updatePassword,
    updateProfileImage,
    getCollege,
    tokenGen,
    options
}