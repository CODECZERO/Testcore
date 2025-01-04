var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import multer from "multer";
import path from "path";
import fs from "fs";
// A function to ensure that the folder exists
const ensureFolder = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (fs.existsSync(filePath)) {
            console.dir(filePath, "exists");
            return true;
        }
        yield fs.promises.mkdir(filePath, { recursive: true });
        return true;
    }
    catch (error) {
        throw new Error(`Error creating directory: ${error.message}`);
    }
});
// Multer function to store file in local server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const folderExistPath = path.resolve(__dirname, '.');
                console.log(folderExistPath);
                yield ensureFolder(folderExistPath);
                console.log("Resolved image path:", folderExistPath); // Log the resolved path
                cb(null, folderExistPath);
            }
            catch (error) {
                cb(error, "");
            }
        });
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedFormats.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB of image size
});
