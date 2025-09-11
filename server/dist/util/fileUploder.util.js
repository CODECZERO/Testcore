var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v2 as fileServer } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
// Configure Cloudinary
fileServer.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDAPISECRET
});
// Function to upload file to Cloudinary
const uploadFile = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!localFilePath)
            return null; // Check if file path is provided
        // Upload file to Cloudinary
        const upload = yield fileServer.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // Remove file from local server
        fs.unlinkSync(localFilePath);
        // Return the URL of the uploaded file
        return upload.url;
    }
    catch (error) {
        console.error("Error uploading file:", error);
        // Remove file from local server in case of error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
});
export { uploadFile };
