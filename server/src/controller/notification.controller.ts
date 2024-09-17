import { sendMessage } from "../services/twilio/twilio.Service.js";
import { ApiError } from "../util/apiError.js";
import AsyncHandler from "../util/ayscHandler.js";
import { Request, Response } from "express";
import { ApiResponse } from "../util/apiResponse.js";
import { getStudnetNumber } from "../db/Query.sql.db.js";
import { UniError } from "../util/UniErrorHandler.js";

//number validiation is need in database

type MessageData = {//message or notification formate 
    message: string,
    collegeID: string,
    SubjectID: string,
}

const MessageSender = async (message: string, collegeID: string, SubjectID: string) => {//send message fucntion
    try {
   
        const Numbers: any[] = await getStudnetNumber(collegeID, SubjectID);//finds mobile number of student form database
        const sendMessages = Promise.all(//takes all the phone number
            Numbers.map(async (number) => {//loop and take one number from array of numbers
                await sendMessage(number, message);//calls this function , which is core function of sending message
            })
        )

        return sendMessages;//return data after all message are successfuly send
    } catch (error) {
        throw new ApiError(500, `something went wrong while sending message ${error}`);
    }
}

const messageHandler = AsyncHandler(async (req: Request, res: Response) => {//this function take data from user/examiner
    const MessageData: MessageData = req.body;//take message in message formate
    if (!MessageData || !MessageData.SubjectID || !MessageData.collegeID || !MessageData.message) throw new ApiError(400, "Data is not provided correctly");//vlaid if data is given or not

    const MessageResult = await MessageSender(MessageData.message, MessageData.collegeID, MessageData.SubjectID);//call the upper function to send message

    if (!MessageResult || MessageResult.length === 0 || MessageResult instanceof UniError) throw new ApiError(500, `Message was not abel to send`);//if any error occure throw error

    return res.status(200).json(new ApiResponse(200, MessageResult, "Message send successfuly"));//if not occure then send message

})

export { messageHandler }