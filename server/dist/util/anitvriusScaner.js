var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
const VIRUSTOTALKEY = process.env.VIRUSTOTALAPI;
const scanFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        const response = yield axios.post('https://www.virustotal.com/api/v3/files', form, {
            headers: Object.assign(Object.assign({}, form.getHeaders()), { 'x-apikey': VIRUSTOTALKEY })
        });
        const { malicious, suspicious } = response.data.data.attributes.last_analysis_stats;
        // Determine if the file is malware
        const isMalware = malicious > 0 || suspicious > 0;
        return isMalware;
    }
    catch (error) {
        throw new Error(`Error during virus scan: ${error}`);
    }
});
export default scanFile;
