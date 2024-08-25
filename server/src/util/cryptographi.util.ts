import { Cipher, createCipheriv, generateKeyPair, randomBytes, scrypt } from "crypto";
import { nanoid } from "nanoid";
import { ApiError } from "./apiError.js";

const generateKeys = async () => {
    try {
        const algorithm = 'aes-192-cbc';
        const key = await nanoid(32).toString();
        const iv = await random(24);//initialization vectore
        if (!(algorithm || key || iv)) throw new ApiError(500, "something went wrong while genreateing keys");
        scrypt(key, 'salt', 24, (err, key) => {
            if (err) throw err;
            // Then, we'll generate a random initialization vector
            randomFill(new Uint8Array(16), (err, iv) => {
              if (err) throw err;

        const cipher = createCipheriv(algorithm, key, iv);
        let encrypted = '';
        cipher.setEncoding('hex');

        cipher.on('data', (chunk) => encrypted += chunk);
        cipher.on('end', () => console.log(encrypted));

        cipher.write('some clear text data');
        cipher.end();
        console.log(cipher);

    }
    catch (error) {
        throw new ApiError(500, error);
    }
};

export default generateKeys;