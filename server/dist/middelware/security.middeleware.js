import { check, validationResult } from 'express-validator';
import xss from "xss";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";
const valiAndSan = [
    check('*').trim().escape().customSanitizer(value => xss(value)), //checks for data which is provided by user
];
const validateAndSanitizeFunction = (req, res, next) => {
    const InputResult = validationResult(req); //takes data and pass to function and store it value
    if (!InputResult.isEmpty()) { //then check if it' emtpy then it will return data
        return res.status(400).json(new ApiResponse(400, new ApiError(400, `Invalid request ${InputResult}`)));
    }
    next();
};
const validateAndSanitize = [
    ...valiAndSan,
    validateAndSanitizeFunction,
];
export default validateAndSanitize;
