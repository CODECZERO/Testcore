var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import amqplib from 'amqplib';
class rabbitMqFunction {
    constructor() {
        this.exchangeName = 'chat_exchagne';
        this.messageTTL = '';
        // private queueName = "MessageStore"
        this.connectRabbitMq = (MessageEnc, roomName) => __awaiter(this, void 0, void 0, function* () {
            const connection = yield amqplib.connect(process.env.RABBITMQURL);
            const channel = yield connection.createChannel();
            yield channel.assertExchange(this.exchangeName, roomName, {
                durable: true,
            });
            this.channel = channel;
        });
        this.publishData = (messageEnc, roomName) => __awaiter(this, void 0, void 0, function* () {
            yield this.channel.publish(this.exchangeName, roomName, Buffer.from(messageEnc), { persistent: true });
        });
        this.subData = (roomName) => __awaiter(this, void 0, void 0, function* () {
            this.queue = yield this.channel.assertQueue(roomName, { exclusive: false });
            const message = yield this.channel.bindQueue(this.queue.queue, this.exchangeName, roomName);
            return message;
        });
    }
}
export default rabbitMqFunction;
