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
    const filePath = req.filePath;
    if (!filePath)
        throw new ApiError(400, "File address not provided");
    const scanResult = yield scanFile(filePath);
    if (!scanResult)
        next();
    yield fs.promises.unlink(filePath);
    res.status(400).send({ message: 'Malware detected' });
    next();
}));
