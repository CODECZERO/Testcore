import { createCipheriv, createDecipheriv } from "crypto";
import { ApiError } from "./apiError.js";
const algorithm = 'aes-256-cbc'; // The algorithm to use (AES in this case)
const encryptDataFunc = (message, secretKey, iv) => {
    try {
        const cipher = createCipheriv(algorithm, secretKey, iv);
        let encrypt = cipher.update(message, "utf-8", 'hex');
        encrypt += cipher.final('hex');
        return encrypt;
    }
    catch (error) {
        throw new ApiError(500, "something went wrong while encrypting data");
    }
};
const decryptDataFunc = (encryptData, secretKey, iv) => {
    try {
        const decipher = createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
        let decryptData = decipher.update(encryptData, 'hex', 'utf-8');
        decryptData += decipher.final('utf-8');
        return decryptData;
    }
    catch (error) {
        throw new ApiError(500, "something went wrong while decrypting data");
    }
};
export { encryptDataFunc, decryptDataFunc };
