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
import { ClassModel } from '../models/class.model.nosql.js';
const options = {
    httpOnly: true,
    secure: true
};
const tokenGen = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const [accessToken, refreshToken] = yield Promise.all([
        genAccToken(user),
        genReffToken(user), //calling genReffToken function to genrate refersh token for server
    ]);
    return { accessToken, refreshToken }; //returing both of theme
});
//give access to data and other stuff aka login logic
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
    const [tokenResult, trackerUpdate] = yield Promise.all([
        tokenGen(findAndRole),
        Tracker(findUser.Id, req) //save's user ip adrress in database  ;
    ]);
    const { refreshToken, accessToken } = tokenResult; //genereating token for the user
    const data = Object.assign(Object.assign({}, findUser), { refreshToken });
    yield updateOp(data, role); //pass the role to user it's necessary
    const { password: _ } = findUser, userData = __rest(findUser, ["password"]); //removing user password form find user
    return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json(new ApiResponse(200, { userData, trackerUpdate, accessToken }, "Login in successfully"));
}));
//registering user on the site and store data on sql/postgresSql
//
const signup = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phoneNumber, address, role } = req.body;
    //checking if values are provide or not if not provide throw error 
    if (!(email && password && phoneNumber && address && name && role))
        throw new ApiError(400, "All fields are required");
    const findUser = yield findOp({ email, role }); //passing req.body value to query function
    if (findUser)
        return res.status(409).json(new ApiError(409, "user exists"));
    //if it exist throw error in this formate
    // {
    //     "statusCode": 409,
    //     "data": "user exists",
    //     "success": false,
    //     "errors": []
    // } 
    const findAndRole = Object.assign(Object.assign({}, findUser), { role });
    const tokenResult = yield tokenGen(findAndRole);
    const hashedPassword = yield bcrypt.hash(password, 10);
    if (!(tokenResult && hashedPassword))
        throw new ApiError(400, "something went wrong while hashing password");
    const { refreshToken, accessToken } = tokenResult; //genereating token for the user
    const UserSingupData = Object.assign(Object.assign({}, req.body), { refreshToken });
    const userCreate = yield createOp(UserSingupData, hashedPassword); //passing req.body value to query function with hashed password
    const userData = { userCreate, password: "" }; //replacing the password with empty string
    const saveUserInNosql = yield User.create({
        sqlId: userCreate.Id,
    });
    if (!userData || !saveUserInNosql)
        throw new ApiError(500, "Something went wrong while registering the user"); //if user isn't create then throw error
    return res.status(201).cookie('accessToken', accessToken, options).json(//if create then return user data
    new ApiResponse(201, { userData, accessToken }, "User create successfuly"));
}));
//
//
const updatePassword = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //updates password of user based on the roles
    const { email, role } = req.user || req.body; //taking email,role,passwrod from user
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
    const userData = req.user || {};
    if (!fileURI)
        return res.status(400).json(new ApiError(400, "please provide images"));
    const upload = yield uploadFile(fileURI); //upload file on the cloud server
    if (!(upload && userData.email))
        return res.status(500).json(new ApiError(500, "error while uploading file on server"));
    const user = yield User.findOneAndUpdate(//finding user on mongodb if it'exists with that email id then chage photo
    { email: userData.email }, {
        $set: {
            sqlId: userData === null || userData === void 0 ? void 0 : userData.Id,
            profile: upload,
        },
    }, { new: true, projection: { profile: true, _id: false } });
    let updateProfile = null;
    if (!(user)) { //if user does not exist then create it
        updateProfile = yield User.create({
            sqlId: userData === null || userData === void 0 ? void 0 : userData.Id,
            profile: upload
        });
    } //if there is any issues while updating data on monogodb
    //then return error
    return res.status(200).json(new ApiResponse(200, updateProfile || (user === null || user === void 0 ? void 0 : user.profile), "user profile image updated successfuly")); //else return success messsage
}));
//
const getCollege = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findCollegeName = yield findCollege(); //find college name 
    if (!findCollegeName)
        return res.status(400).json(new ApiError(400, "No college is register")); //throws error if it doesn't exists
    return res.status(200).json(new ApiResponse(200, findCollegeName)); //returns college name
}));
const SessionActive = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.user; //takes token from frontend
    const role = req.user.role;
    if (!refreshToken || !role)
        throw new ApiError(401, "user is not auth"); //if user doesn't have token then throw error
    const verify = yield findOp({ role, email: refreshToken.email }); // find user in database
    if (!verify)
        throw new ApiError(401, "user is not auth"); //if user is not verify
    return res.status(200).json(new ApiResponse(200, verify, "user is auth")); //return res and verfiy data
}));
const getClass = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //it may be used futher
    const UserClass = yield ClassModel.find({}).select('name _id'); //taking name and id from the schema
    if (!UserClass)
        throw new ApiError(404, "Class not fount");
    return res.status(200).json(new ApiResponse(200, UserClass, "user class"));
}));
const createClass = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Classname } = req.body; //taking class name from user, takes class name from user and make class using it
    if (!Classname)
        throw new ApiError(400, "class name is not provided");
    const createClassForuser = yield ClassModel.create({
        name: Classname //create class
    });
    if (!createClassForuser)
        throw new ApiError(406, "unable to create class or class existe");
    return res.status(200).json(new ApiResponse(200, createClassForuser, "class created successfuly")); //return if successfuly
}));
const getProfileImage = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    if (!(userData.email || userData.Id))
        throw new ApiError(401, "unauthorized action");
    const user = yield User.findOne({
        email: userData.email
    }, {
        profile: true,
        _id: false
    });
    if (!user)
        throw new ApiError(404, "user profile not found");
    return res.status(400).json(new ApiResponse(200, user, "found user Profile Image"));
}));
export { signup, login, updatePassword, updateProfileImage, getCollege, tokenGen, SessionActive, options, getClass, createClass, getProfileImage };
