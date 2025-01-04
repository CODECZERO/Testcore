import axios, { AxiosResponse } from "axios";
import { response } from "express";
import FormData from "form-data";
import fs from "fs";

interface VirusTotalResponse {
    data: {
        attributes: {
            stats: {
                malicious: number;
                suspicious: number;
                undetected: number;
                harmless: number;
            };
            last_analysis_results: Record<string, {
                category: string;
                result: string;
            }>;
        };
    };
}

const uploadFile = async (filePath: string): Promise<string | any> => {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        const response: AxiosResponse<VirusTotalResponse> = await axios.post(
            'https://www.virustotal.com/api/v3/files',
            form, {
            headers: {
                accept: 'application/json' ,
                'content-type': 'multipart/form-data',
                'x-apikey': process.env.VIRUSTOTALAPI,

                ...form.getHeaders(),
            }
        }
        );

        return response.data;
    } catch (error: any) {
        return error;
    }
};

const getFiledata = async (Id: string): Promise<string | any> => {
    try {
        const response: AxiosResponse<VirusTotalResponse> = await axios.get(
            `https://www.virustotal.com/api/v3/analyses/${Id}`,
            {
            headers: {
                accept: 'application/json',
                'x-apikey': process.env.VIRUSTOTALAPI,
            }
        }
        );

        if(!response) return "No response from VirusTotal";

        return response.data.data;
    } catch (error) {
        return error;
    }
}
const scanFile = async (filePath: string): Promise<boolean> => {
    try {

        const uploadFileData = await uploadFile(filePath);
        const fileData = await getFiledata(uploadFileData.data.id);
        const { malicious, suspicious } = fileData.attributes.stats;

        // Determine if the file is malware
        const isMalware = malicious > 0 || suspicious > 0;

        return isMalware;
    } catch (error) {
        throw new Error(`Error during virus scan: ${error}`);
    }
}

export default scanFile;
