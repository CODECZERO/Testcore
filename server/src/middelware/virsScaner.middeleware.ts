import AsyncHandler from "../util/ayscHandler.js";
import { ApiError } from "../util/apiError.js";
import { Request,Response,NextFunction } from "express";
import fs from "fs";
import scanFile from "../util/anitvriusScaner.js";

// Extend the Express Request interface
interface CustomRequest extends Request {
    file?: Express.Multer.File;
}

export const ScanForVirus = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {//this function scans the file which are uploaded on the server
    const filePath = req.file?.path;//takes file path 
    console.log(req.file);
    console.log(req);
    if (!filePath) throw new ApiError(400, "File address not provided");

    const scanResult= await scanFile(filePath);//put the file through virus scan
    if(!scanResult) next();//if there is no result then it means , it's malaware free
    await fs.promises.unlink(filePath)//else remove the file from server
    res.status(400).send({ message: 'Malware detected' });//and not uploaded to cloud
    next()
});
