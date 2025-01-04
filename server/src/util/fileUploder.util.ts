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
const uploadFile = async (localFilePath: string): Promise<string | null> => {
    try {
        if (!localFilePath) return null; // Check if file path is provided

        // Upload file to Cloudinary
        const upload = await fileServer.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // Remove file from local server
        fs.unlinkSync(localFilePath);

        // Return the URL of the uploaded file
        return upload.url;
    } catch (error) {
        console.error("Error uploading file:", error);

        // Remove file from local server in case of error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadFile };
