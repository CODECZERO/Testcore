var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/user.model.nosql.js";
import { ApiError } from "../util/apiError.js";
const Tracker = (Id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const IpAddress = String(req.ip); //takes ip address of  device
    const userAgent = String(req.headers['user-agent']); // header or user agent
    if (!Id || !IpAddress || !userAgent)
        throw new ApiError(400, "invalid request"); //throw error if not provided
    const deviceSave = yield User.updateOne({
        sqlId: Id, //user id
    }, {
        logInDevices: {
            IpAddress,
            userAgent,
        }
    });
    if (!deviceSave)
        throw new ApiError(404, "user not find");
    return deviceSave; //return if every thing goes correct
});
export default Tracker;
