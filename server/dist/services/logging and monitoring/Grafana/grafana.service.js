var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { register, collectDefaultMetrics, Counter } from 'prom-client';
// Collect default metrics (CPU, Memory, etc.)
const collection = collectDefaultMetrics({ register });
// Custom metric - Counter
const requestCounter = new Counter({
    name: 'node_request_count',
    help: 'Total number of requests',
});
// Register the custom metric
register.registerMetric(requestCounter);
// Middleware to count requests
const MiddlewareCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    requestCounter.inc(); // Increment the counter
    next();
});
const metric = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.set('Content-Type', register.contentType);
    res.end(yield register.metrics());
});
export { metric, MiddlewareCount };
