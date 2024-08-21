import { errorLoger } from "../../models/errorLog.model.nosql.js";
import { ApiError } from "../../util/apiError.js";
import winston from "winston";


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Log to console for development
    // Add other transports like file, database, etc.
  ]
});

const errorDataLoger = async (level: string, error: any) => {
  try {
    const errorData = {
      level,
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      // Add other relevant error details
    };

    const savedError = await errorLoger.create(errorData);
    logger.info(`Error logged to database: ${savedError._id}`);
  } catch (error) {
    logger.error('Error logging error to database:', error);
  }
};

export {
    errorDataLoger
}