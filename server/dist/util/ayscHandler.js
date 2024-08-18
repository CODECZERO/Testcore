import { ApiError } from '../util/apiError.js'; // Assuming an ApiError class for standardized error responses
const AsyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => {
            // Log the error for debugging purposes
            console.error(error);
            // Handle specific error types if needed
            if (error instanceof ApiError) {
                return next(error); // Pass ApiError to error middleware
            }
            // Create a generic error response
            const apiError = new ApiError(500, 'Internal Server Error');
            next(apiError);
        });
    };
};
export default AsyncHandler;
