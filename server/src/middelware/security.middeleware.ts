import { Request, Response, NextFunction } from "express"
import { check, validationResult } from 'express-validator';
import xss from "xss";
import { ApiError } from "../util/apiError.js";
import { ApiResponse } from "../util/apiResponse.js";


const valiAndSan = [
    check('*').trim().escape().customSanitizer(value => xss(value)),
];

const validateAndSanitizeFunction = (req: Request, res: Response, next: NextFunction) => {
    const InputResult = validationResult(req);
    if (!InputResult.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, new ApiError(400, `Invalid request ${InputResult}`)));
    }
    console.log(req.body);
    next();

}

const validateAndSanitize = [
    ...valiAndSan,
    validateAndSanitizeFunction,
]

export default validateAndSanitize;