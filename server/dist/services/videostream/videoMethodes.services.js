import { UniError } from "../../util/UniErrorHandler.js";
import { createTransportForService, createWorkerForService, createRouterForService } from "./videoCoreMethode.services.js";
import { WebSocket } from "ws";
class VideoMethode {
    constructor() {
        /**
         * Start connection - Initialize worker and router
         */
        this.startConnection = async () => {
            try {
                this.worker = await createWorkerForService();
                this.router = await createRouterForService(this.worker);
                return this.router;
            }
            catch (error) {
                throw new UniError(`Error while connecting to server: ${error}`);
            }
        };
        /**
         * Get router RTP capabilities and send to client
         */
        this.getRouterRtpCapabilities = async (ws, router) => {
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
        };
        /**
         * Create transport for service
         */
        this.createTransportForService = async (router) => {
            try {
                if (!router) {
                    throw new UniError("Router not provided");
                }
                const transport = await createTransportForService(router);
                return transport;
            }
            catch (error) {
                throw new UniError(`Error while creating transport for service: ${error}`);
            }
        };
        /**
         * Close connection - Clean up worker and router
         */
        this.closeConnection = async () => {
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
        };
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
