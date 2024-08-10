import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../util/apiError.js'; // Assuming an ApiError class for standardized error responses

const AsyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((error: any) => {
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
