import { UniError } from "../../util/UniErrorHandler.js";
import { clinet } from "./twilioClinet.service.js";

const sendMessage = async (number:string, message: string) => {
    try {
        return clinet.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_ACCOUNT_FROM}`,
            to: `whatsapp:${number}`
        })
    } catch (error) {
        throw new UniError(`Error while sending message ${error}`)
    }

}

export { sendMessage }