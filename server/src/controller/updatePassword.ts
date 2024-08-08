import { Request, Response } from 'express';
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
import bcrypt from "bcrypt";
import { updatePasswordInDB } from './userQuery.controller.js';

const updatePassword = async (req: Request, res: Response) => {
    const { email, role, password } = req.body; //taking email,role,passwrod from user
    if (!(password || role || email)) return res.status(400).json("password is not provided"); //if not found then return error
    const hashedPassword = await bcrypt.hash(password, 10); //hash password
    const update = await updatePasswordInDB(req.body, hashedPassword); //chage hash password in db

    if (!update) {
        res.status(500).json(new ApiError(500, "error while updating password"));
    }; //if update is fail then error

    //else return output
    return res.status(200).json(new ApiResponse(200, "password update successfuly"));
};
