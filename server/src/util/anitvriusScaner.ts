import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import fs from "fs";

const VIRUSTOTALKEY = process.env.VIRUSTOTALAPI as string;

interface VirusTotalResponse {
    data: {
        attributes: {
            last_analysis_stats: {
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

const scanFile = async (filePath: string): Promise<boolean> => {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response: AxiosResponse<VirusTotalResponse> = await axios.post(
            'https://www.virustotal.com/api/v3/files',
            form, {
                headers: {
                    ...form.getHeaders(),
                    'x-apikey': VIRUSTOTALKEY,
                }
            }
        );

        const { malicious, suspicious } = response.data.data.attributes.last_analysis_stats;

        // Determine if the file is malware
        const isMalware = malicious > 0 || suspicious > 0;

        return isMalware;
    } catch (error) {
        throw new Error(`Error during virus scan: ${error}`);
    }
}

export default scanFile;
