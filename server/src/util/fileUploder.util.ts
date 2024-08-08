import { v2 as fileServer} from "cloudinary";
import fs from "fs";
fileServer.config({//config key for fileServer to access the server
    cloud_name:process.env.CLOUDNAME,
    api_key:process.env.CLOUDAPIKEY,
    api_secret:process.env.CLOUDAPISECRET
})

//this function is going to upload file on server but before that we are going to store it on local server and then upload it to cloud server
const uploadFile=async(localFilePath:any)=>{
    try {
        if(!localFilePath)return null;//checking if file path is therer
        const upload=await fileServer.uploader.upload(localFilePath,{//uploading it on server
            resource_type:"auto"
        });
        fs.unlinkSync(localFilePath);//removing it from local file
        return upload.url;//reutnring it's link
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadFile}

