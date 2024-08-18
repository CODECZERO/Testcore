import { NextFunction,Request,Response } from "express";
import axios from 'axios';
import { register,collectDefaultMetrics,Counter } from 'prom-client';

// Collect default metrics (CPU, Memory, etc.)
const collection =collectDefaultMetrics({ register });

// Custom metric - Counter
const requestCounter = new Counter({
  name: 'node_request_count',
  help: 'Total number of requests',
});

// Register the custom metric
register.registerMetric(requestCounter);


// Middleware to count requests
const MiddlewareCount=async(req:Request,res:Response,next:NextFunction)=>{
    requestCounter.inc(); // Increment the counter
    next();
  }


const metric=async (req:Request, res:Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
}

export {
    metric,
    MiddlewareCount
}