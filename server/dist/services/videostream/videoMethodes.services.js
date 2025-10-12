var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UniError } from "../../util/UniErrorHandler.js";
import { createTransportForService, createWorkerForService, createRouterForService } from "./videoCoreMethode.services.js";
import { WebSocket } from "ws";
class VideoMethode {
    constructor() {
        /**
         * Start connection - Initialize worker and router
         */
        this.startConnection = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.worker = yield createWorkerForService();
                this.router = yield createRouterForService(this.worker);
                return this.router;
            }
            catch (error) {
                throw new UniError(`Error while connecting to server: ${error}`);
            }
        });
        /**
         * Get router RTP capabilities and send to client
         */
        this.getRouterRtpCapabilities = (ws, router) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!router || !ws) {
                    throw new UniError("WebSocket or router not provided");
                }
                if (ws.readyState !== WebSocket.OPEN) {
                    throw new UniError("WebSocket is not open");
                }
                ws.send(JSON.stringify({
                    action: "rtpCapabilities",
                    rtpCapabilities: router.rtpCapabilities
                }));
            }
            catch (error) {
                throw new UniError(`Error while getting router capabilities: ${error}`);
            }
        });
        /**
         * Create transport for service
         */
        this.createTransportForService = (router) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!router) {
                    throw new UniError("Router not provided");
                }
                const transport = yield createTransportForService(router);
                return transport;
            }
            catch (error) {
                throw new UniError(`Error while creating transport for service: ${error}`);
            }
        });
        /**
         * Close connection - Clean up worker and router
         */
        this.closeConnection = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.router) {
                    this.router.close();
                    this.router = undefined;
                }
                if (this.worker) {
                    this.worker.close();
                    this.worker = undefined;
                }
            }
            catch (error) {
                throw new UniError(`Error while closing connection: ${error}`);
            }
        });
        /**
         * Check if service is initialized
         */
        this.isInitialized = () => {
            return !!(this.worker && this.router);
        };
        this.router = undefined;
        this.worker = undefined;
    }
}
const videoMethode = new VideoMethode();
export default videoMethode;
