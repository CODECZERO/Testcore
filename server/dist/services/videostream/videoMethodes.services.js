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
class VideoMethode {
    constructor() {
        this.getRouterRtpCapabilities = (ws, router) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!router || !ws)
                    throw new UniError("websocket or router is not provied");
                ws.send(JSON.stringify(router.rtpCapabilities));
            }
            catch (error) {
                throw new UniError(`error while geting routercapablilities ${error}`);
            }
        });
        this.createTransportForService = (router, sender, producerTransport, consumerTransport) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transport = yield createTransportForService(router);
                if (sender) {
                    producerTransport = transport;
                }
                return consumerTransport = transport;
            }
            catch (error) {
                throw new UniError(`error while creatin tranport for service ${error}`);
            }
        });
        this.connectTransport = (sender, dtlsParameters, producerTransport, consumerTransport) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (sender) {
                    return yield (producerTransport === null || producerTransport === void 0 ? void 0 : producerTransport.connect({ dtlsParameters }));
                }
                return yield (consumerTransport === null || consumerTransport === void 0 ? void 0 : consumerTransport.connect({ dtlsParameters }));
            }
            catch (error) {
                throw new UniError(`error in connection transport ${error}`);
            }
        });
        this.producer = (producerTransport, kind, rtpParameters) => __awaiter(this, void 0, void 0, function* () {
            try {
                const producerData = yield producerTransport.produce({
                    kind,
                    rtpParameters
                });
                return producerData;
            }
            catch (error) {
                throw new UniError(`error in producer ${error}`);
            }
        });
        this.consumer = (consumerTransport, router, producerId, rtpCapabilities) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!router.canConsume)
                    throw new UniError("unable to consume data");
                router.canConsume({ producerId: producerId, rtpCapabilities });
                const consumer = yield consumerTransport.consume({
                    producerId,
                    rtpCapabilities,
                    paused: false
                });
                return consumer;
            }
            catch (error) {
                throw new UniError(`error in consumer ${error}`);
            }
        });
        this.startConnection = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.worker = yield createWorkerForService();
                this.router = yield createRouterForService(this.worker);
                return this.router;
            }
            catch (error) {
                throw new UniError(`error while connecting to server ${error}`);
            }
        });
        this.router = undefined;
        this.worker = undefined;
    }
}
const videoMethode = new VideoMethode();
export default videoMethode;
