import { Cipher, createCipheriv, createDecipheriv, generateKeyPair, randomBytes, scrypt } from "crypto";
import { nanoid } from "nanoid";
import { ApiError } from "./apiError.js";

const algorithm = 'aes-256-cbc'; // The algorithm to use (AES in this case)



const encryptDataFunc=(message:string,secretKey:string,iv:Buffer)=>{
   try {
     const cipher=createCipheriv(algorithm,secretKey,iv);
     let encrypt=cipher.update(message,"utf-8",'hex');
     encrypt+=cipher.final('hex');
     return encrypt;
 
   } catch (error) {
        throw new ApiError(500,"something went wrong while encrypting data");
   }

}

const decryptDataFunc=(encryptData:string,secretKey:string,iv:string)=>{
    try {
        const decipher=createDecipheriv(algorithm,secretKey,Buffer.from(iv,'hex'));
        let decryptData=decipher.update(encryptData,'hex','utf-8');
        decryptData+=decipher.final('utf-8');
        return decryptData;
    } catch (error) {
        throw new ApiError(500,"something went wrong while decrypting data");
    }
}

export {
    encryptDataFunc,
    decryptDataFunc

};