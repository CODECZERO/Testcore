var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiError } from './apiError.js'; // Assuming you have an ApiError class
export function ErrorHandler(fn) {
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (error) {
            // Log the error (consider using a logging library like Winston)
            console.error('Error:', error);
            // Send a formatted error response (if applicable)
            const errorResponse = {
                message: error,
                // Add other relevant error details as needed
                stackTrace: error, // Include stack trace for debugging
            };
            console.log(error);
        }
        throw new ApiError(500, Error);
    });
}
;
export default ErrorHandler;
