var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import bcrypt from "bcrypt";
import { genAccToken, genReffToken } from '../util/jwtOp.util.js';
import { createOp, findCollege, findOp, updateOp, updatePasswordInDB } from '../db/Query.sql.db.js';
import { uploadFile } from '../util/fileUploder.util.js';
import { User } from '../models/user.model.nosql.js';
import AsyncHandler from '../util/ayscHandler.js';
import Tracker from './loginTracker.controller.js';
//all error retunr/out format
// {
//     "statusCode": error status code,
//     "data": "eror message",
//     "success": false,
//     "errors": []
// } 
const options = {
    httpOnly: true,
    secure: true
};
const tokenGen = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accesToken = yield genAccToken(user); //calling genAccToken function to genrate access token for user
    const refreshToken = yield genReffToken(user); //calling genReffToken function to genrate refersh token for server
    return { accesToken, refreshToken }; //returing both of theme
});
//
const login = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    if (!(email && password && role))
        throw new ApiError(400, "Invaild email id,role or password");
    const findUser = yield findOp({ email, role }); //finding user using email
    if (!findUser)
        throw new ApiError(400, "Invaild User"); //checking if user passwrod is valid or not
    const passwordCheck = yield bcrypt.compare(password, findUser.password);
    if (!passwordCheck)
        throw new ApiError(400, "Invalid password");
    const findAndRole = Object.assign(Object.assign({}, findUser), { role });
    const { refreshToken, accesToken } = yield tokenGen(findAndRole); //genereating token for the user
    const data = Object.assign(Object.assign({}, findUser), { refreshToken });
    yield updateOp(data, role); //pass the role to user it's necessary
    const trackerUpdate = yield Tracker(findUser.Id, req);
    const { password: _ } = findUser, userWithOutPassword = __rest(findUser, ["password"]); //removing user password form find user
    return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accesToken", accesToken, options).json(new ApiResponse(200, { userWithOutPassword, trackerUpdate }, "Login in successfully"));
}));
//registering user on the site and store data on sql/postgresSql
//
const signup = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phoneNumber, address, role } = req.body;
    //checking if values are provide or not if not provide throw error 
    if (!(email && password && phoneNumber && address && name && role))
        throw new ApiError(400, "All fields are required");
    const findUser = yield findOp(req.body); //passing req.body value to query function
    if (findUser)
        return res.status(409).json(new ApiError(409, "user exists"));
    //if it exist throw error in this formate
    // {
    //     "statusCode": 409,
    //     "data": "user exists",
    //     "success": false,
    //     "errors": []
    // } 
    const hashedPassword = yield bcrypt.hash(password, 10); //hashing the password
    const userCreate = yield createOp(req.body, hashedPassword); //passing req.body value to query function with hashed password
    const userData = { userCreate, password: "" }; //replacing the password with empty string
    const saveUserInNosql = yield User.create({
        sqlId: userCreate.Id,
    });
    if (!userData || !saveUserInNosql)
        throw new ApiError(500, "Something went wrong while registering the user"); //if user isn't create then throw error
    return res.status(201).json(//if create then return user data
    new ApiResponse(201, userData, "User create successfuly"));
}));
//
const updatePassword = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //updates password of user based on the roles
    const { email, role } = req.user; //taking email,role,passwrod from user
    const { password } = req.body;
    if (!(password && role && email))
        return res.status(400).json("password is not provided"); //if not found then return error
    const hashedPassword = yield bcrypt.hash(password, 10); //hash password
    const update = yield updatePasswordInDB(req.user, hashedPassword); //chage hash password in db
    if (!update) {
        throw new ApiError(500, "error while updating password");
    }
    ; //if update is fail then error
    //else return output
    return res.status(200).json(new ApiResponse(200, "password update successfuly"));
}));
//
const updateProfileImage = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fileURI = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const { role, refreshToken } = req.body;
    const findUser = yield findOp({
        email: "",
        refreshToken,
        role,
        name: '',
        phoneNumber: '',
        address: '',
    }); //finding user using email
    if (!fileURI)
        return res.status(400).json(new ApiError(400, "please provide images"));
    const upload = yield uploadFile(fileURI); //upload file on the cloud server
    if (!(upload && findUser.email))
        return res.status(500).json(new ApiError(500, "error while uploading file on server"));
    const user = yield User.findOneAndUpdate(//finding user on mongodb if it'exists with that email id then chage photo
    findUser.email, {
        $set: {
            sqlId: findUser === null || findUser === void 0 ? void 0 : findUser.id,
            profile: upload,
        }
    });
    let updateProfile = null;
    if (!user) { //if user does not exist then create it
        updateProfile = yield User.create({
            sqlId: findUser === null || findUser === void 0 ? void 0 : findUser.Id,
            profile: upload
        });
    } //if there is any issues while updating data on monogodb
    //then return error
    return res.status(200).json(new ApiResponse(200, updateProfile || user, "user profile image updated successfuly")); //else return success messsage
}));
//
const getCollege = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findCollegeName = yield findCollege(); //find college name 
    if (!findCollegeName)
        return res.status(400).json(new ApiError(400, "No college is register")); //throws error if it doesn't exists
    return res.status(200).json(new ApiResponse(200, findCollegeName)); //returns college name
}));
export { signup, login, updatePassword, updateProfileImage, getCollege, tokenGen, options };
