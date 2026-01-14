import amqplib from 'amqplib';
class rabbitMqFunction {
    constructor() {
        this.exchangeName = 'chat_exchagne';
        this.messageTTL = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
        // private queueName = "MessageStore"
        this.connectRabbitMq = async (roomName) => {
            if (!this.connection)
                this.connection = await amqplib.connect(process.env.RABBITMQURL);
            if (!this.channel) {
                this.channel = await this.connection.createChannel();
                this.channel.assertExchange(this.exchangeName, 'topic', {
                    durable: true,
                });
            }
        };
        this.publishData = async (messageEnc, roomName) => {
            if (!this.channel) {
                await this.connectRabbitMq(roomName);
            }
            await this.channel.publish(this.exchangeName, roomName, Buffer.from(messageEnc), { persistent: true });
        };
        this.subData = async (roomName) => {
            if (!this.channel) {
                await this.connectRabbitMq(roomName);
            }
            this.queue = await this.channel.assertQueue(roomName, { exclusive: false, arguments: { 'x-message-ttl': this.messageTTL, } });
            const message = await this.channel.bindQueue(this.queue.queue, this.exchangeName, roomName);
            return message;
        };
        this.closeConnection = async () => {
            await this.channel.close();
            await this.connection.close();
        };
    }
}
const rabbitmq = new rabbitMqFunction();
export default rabbitmq;
