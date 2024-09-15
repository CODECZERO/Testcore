import { UniError } from "../../util/UniErrorHandler.js";
import { clinet } from "./twilioClinet.service.js";

const sendMessage = async (number: string, message: string) => {
    try {
        const result = await clinet.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_ACCOUNT_FROM}`,
            to: `whatsapp:${number}`
        })
        return result;
    } catch (error) {
        console.log(new UniError(`Error while sending message ${error}`))
    }

}

export { sendMessage }