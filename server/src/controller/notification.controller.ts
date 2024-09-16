import { sendMessage } from "../services/twilio/twilio.Service.js";
import { ApiError } from "../util/apiError.js";
import AsyncHandler from "../util/ayscHandler.js";
import { Request, Response } from "express";
import { ApiResponse } from "../util/apiResponse.js";
import { getStudnetNumber } from "../db/Query.sql.db.js";
import { UniError } from "../util/UniErrorHandler.js";

//number validiation is need in database

type MessageData = {
    message: string,
    collegeID: string,
    SubjectID: string,
}

const MessageSender = async (message: string, collegeID: string, SubjectID: string) => {
    try {
   
        const Numbers: any[] = await getStudnetNumber(collegeID, SubjectID);
        const sendMessages = Promise.all(
            Numbers.map(async (number) => {
                await sendMessage(number, message);
            })
        )

        return sendMessage;
    } catch (error) {
        throw new ApiError(500, `something went wrong while sending message ${error}`);
    }
}

const messageHandler = AsyncHandler(async (req: Request, res: Response) => {
    const MessageData: MessageData = req.body;
    if (!MessageData || !MessageData.SubjectID || !MessageData.collegeID || !MessageData.message) throw new ApiError(400, "Data is not provided correctly");

    const MessageResult = await MessageSender(MessageData.message, MessageData.collegeID, MessageData.SubjectID);

    if (!MessageResult || MessageResult.length === 0 || MessageResult instanceof UniError) throw new ApiError(500, `Message was not abel to send`);

    return res.status(200).json(new ApiResponse(200, MessageResult, "Message send successfuly"));

})

export { messageHandler }