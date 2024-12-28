var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AsyncHandler from "../util/ayscHandler";
import { ApiError } from "../util/apiError";
import fs from "fs";
import scanFile from "../util/anitvriusScaner";
export const ScanForVirus = AsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path; //takes file path 
    if (!filePath)
        throw new ApiError(400, "File address not provided");
    const scanResult = yield scanFile(filePath); //put the file through virus scan
    if (!scanResult)
        next(); //if there is no result then it means , it's malaware free
    yield fs.promises.unlink(filePath); //else remove the file from server
    res.status(400).send({ message: 'Malware detected' }); //and not uploaded to cloud
    next();
}));
