var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendMessage } from "../services/twilio/twilio.Service.js";
import { ApiError } from "../util/apiError.js";
import AsyncHandler from "../util/ayscHandler.js";
import { ApiResponse } from "../util/apiResponse.js";
import { getStudnetNumber } from "../db/Query.sql.db.js";
import { UniError } from "../util/UniErrorHandler.js";
const MessageSender = (message, collegeID, SubjectID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Numbers = yield getStudnetNumber(collegeID, SubjectID); //finds mobile number of student form database
        const sendMessages = Promise.all(//takes all the phone number
        Numbers.map((number) => __awaiter(void 0, void 0, void 0, function* () {
            yield sendMessage(number, message); //calls this function , which is core function of sending message
        })));
        return sendMessages; //return data after all message are successfuly send
    }
    catch (error) {
        throw new ApiError(500, `something went wrong while sending message ${error}`);
    }
});
const messageHandler = AsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const MessageData = req.body; //take message in message formate
    if (!MessageData || !MessageData.SubjectID || !MessageData.collegeID || !MessageData.message)
        throw new ApiError(400, "Data is not provided correctly"); //vlaid if data is given or not
    const MessageResult = yield MessageSender(MessageData.message, MessageData.collegeID, MessageData.SubjectID); //call the upper function to send message
    if (!MessageResult || MessageResult.length === 0 || MessageResult instanceof UniError)
        throw new ApiError(500, `Message was not abel to send`); //if any error occure throw error
    return res.status(200).json(new ApiResponse(200, MessageResult, "Message send successfuly")); //if not occure then send message
}));
export { messageHandler };
