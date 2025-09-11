var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { errorLoger } from "../../models/errorLog.model.nosql.js";
import winston from "winston";
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(), // Log to console for development
        // Add other transports like file, database, etc.
    ]
});
const errorDataLoger = (level, error) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errorData = {
            level,
            timestamp: new Date(),
            message: error.message,
            stack: error.stack,
            // Add other relevant error details
        };
        const savedError = yield errorLoger.create({
            error: errorData.stack
        });
        logger.info(`Error logged to database: ${savedError._id}`);
    }
    catch (error) {
        logger.error('Error logging error to database:', error);
    }
});
export { errorDataLoger };
