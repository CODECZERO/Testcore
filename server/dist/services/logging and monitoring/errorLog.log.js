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
const errorDataLoger = async (level, error) => {
    try {
        const errorData = {
            level,
            timestamp: new Date(),
            message: error.message,
            stack: error.stack,
            // Add other relevant error details
        };
        const savedError = await errorLoger.create({
            error: errorData.stack
        });
        logger.info(`Error logged to database: ${savedError._id}`);
    }
    catch (error) {
        logger.error('Error logging error to database:', error);
    }
};
export { errorDataLoger };
