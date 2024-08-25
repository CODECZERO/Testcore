import AsyncHandler from "../util/ayscHandler";
import { ApiError } from "../util/apiError";
import { Request,Response,NextFunction } from "express";
import fs from "fs";
import scanFile from "../util/anitvriusScaner";

// Extend the Express Request interface
interface CustomRequest extends Request {
    filePath?: string;
}

export const ScanForVirus = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const filePath = req.filePath;
    if (!filePath) throw new ApiError(400, "File address not provided");

    const scanResult= await scanFile(filePath);
    if(!scanResult) next();
    await fs.promises.unlink(filePath)
    res.status(400).send({ message: 'Malware detected' });
    next()
});
