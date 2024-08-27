var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import kafka from "./kafka.services.js";
const Producer = kafka.producer();
const connectProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Producer.connect();
});
const sendMessageOnKafka = (topicName, messagedata) => __awaiter(void 0, void 0, void 0, function* () {
    Producer.send({
        topic: topicName.toString(),
        messages: [
            {
                value: `${messagedata.MessageId, messagedata.Message}`
            }
        ]
    });
});
const disconnectProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    Producer.disconnect();
});
export { connectProducer, sendMessageOnKafka, disconnectProducer };
