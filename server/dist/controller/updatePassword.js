var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import bcrypt from "bcrypt";
import { updatePasswordInDB } from './userQuery.controller.js';
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role, password } = req.body; //taking email,role,passwrod from user
    if (!(password || role || email))
        return res.status(400).json("password is not provided"); //if not found then return error
    const hashedPassword = yield bcrypt.hash(password, 10); //hash password
    const update = yield updatePasswordInDB(req.body, hashedPassword); //chage hash password in db
    if (!update) {
        res.status(500).json(new ApiError(500, "error while updating password"));
    }
    ; //if update is fail then error
    //else return output
    return res.status(200).json(new ApiResponse(200, "password update successfuly"));
});
